# Slack OAuth demo

## Setup your own app

1. Rename the `.env-template` file to `.env`.
2. Create a [new app][new-app] from scratch.
3. Navigate to **Basic Information**.
4. Set up the environment:

   - Copy the **Signing Secret** to `SLACK_SIGNING_SECRET` in `.env`.
   - Copy the **Client ID** to `SLACK_CLIENT_ID` in `.env`.
   - Copy the **Client Secret** to `SLACK_CLIENT_SECRET` in `.env`.

5. Navigate to **OAuth & Permissions**.
6. Under **Scopes**, add the following _OAuth Scopes_ to **Bot Token Scopes**:

   - `users:read` to list users in a workspace.
   - `im:write` to start direct messages with a user.

7. Under **Redirect URLs**, add a new redirect URL.

   Bolt JS uses `/slack/oauth_redirect` by default.

8. Navigate to **Manage Distribution**.
9. Activate _Public Distribution_.

[new-app]: https://api.slack.com/apps?new_app=1

## Running this demo

While testing, the redirect URL must point to your locally running instance.
Follow [these][local-dev] instructions to set this up.

Run:

```js
npm install
node app.js
```

Bolt JS provides an install path at `/slack/install`:

> This endpoint returns a simple page with an Add to Slack button which
> initiates a direct install of your app.

Upon clicking, authorization is requested. When granted, Slack call's the
Redirect URL.

The app should then store the installation info in a database.

`GET` routes are provided at:

- `/slack/:teamId` to get users in a workspace with `:teamId`
- `/slack/:teamId/:userId` to open a direct message with `:userId` in workspace
  `:teamId`

A workspace's ID is found here: `https://app.slack.com/client/{WORKSPACE_ID}`.

[local-dev]: https://slack.dev/node-slack-sdk/tutorials/local-development

## License

This project is licensed under the MIT License (see [LICENSE](LICENSE)).
