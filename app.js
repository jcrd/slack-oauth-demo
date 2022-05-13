require("dotenv").config();

const { App, ExpressReceiver } = require("@slack/bolt");
const { FileInstallationStore } = require("@slack/oauth");

const Workspace = require("./workspace");

// Development installationStore. Replace with database connection.
// Ref: https://slack.dev/bolt-js/concepts#authenticating-oauth
const fileStore = new FileInstallationStore();

const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  stateSecret: "my-secret",
  scopes: ["users:read", "im:write"],
  installationStore: {
    storeInstallation: async (installation) => {
      const ws = new Workspace(installation);
      console.log(ws.id);

      return await fileStore.storeInstallation(installation);
    },
    fetchInstallation: async (installation) => {
      return await fileStore.fetchInstallation(installation);
    },
    deleteInstallation: async (installation) => {
      return await fileStore.deleteInstallation(installation);
    },
  },
});

const app = new App({
  receiver,
});

receiver.router.get("/slack/:teamId", async (req, res) => {
  // Fetch previous installation data from FileInstallationStore.
  const installation = await fileStore.fetchInstallation({
    teamId: req.params["teamId"],
  });
  const ws = new Workspace(installation);
  for await (const users of ws.users()) {
    res.send(users);
  }
});

receiver.router.get("/slack/:teamId/:userId", async (req, res) => {
  const installation = await fileStore.fetchInstallation({
    teamId: req.params["teamId"],
  });
  const ws = new Workspace(installation);
  const messageUrl = await ws.directMessage(req.params["userId"]);
  res.redirect(messageUrl);
});

(async () => {
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();
