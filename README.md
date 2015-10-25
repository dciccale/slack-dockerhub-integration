# Slack + DockerHub integration

Use the already deployed service at https://hooks-slack-dockerhub.herokuapp.com

Or you can run this service in your own server.

## Usage

### Slack

Set up an [incoming webhook integration](https://my.slack.com/services/new/incoming-webhook/) in your Slack team to try it out.

[See full documentation on incoming webhooks](https://api.slack.com/incoming-webhooks)

### DockerHub

After creating your incoming webhook, you will get a url like this one:

`https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX`

Change the domain from `hooks.slack.com` to `hooks-slack-dockerhub.herokuapp.com`

Create a new webhook on DockerHub and paste the url:

`https://hooks-slack-dockerhub.herokuapp.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX`

Done!
