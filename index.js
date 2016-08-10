'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const fs = require('fs');
const Hapi = require('hapi');
const inert = require('inert');
const marked = require('marked');

const SlackService = require('./slack.service.js');

const server = new Hapi.Server();
const port = process.env.PORT || 8080;

server.connection({port: port});
server.register(inert, () => {});

const readme = fs.readFileSync(`${__dirname}/README.md`, 'utf8');
const docs = marked(readme);

server.route({
  method: 'GET',
  path:'/{param*}',
  handler: (req, res) => res(docs))
});

server.route({
  method: 'GET',
  path: '/docker-logo.png',
  handler: (req, res) => res.file(`${__dirname}/docker-logo.png`))
});

server.route({
  method: 'POST',
  path:'/services/{id*}',
  handler: function (req, res) {
    const slackService = new SlackService(req.params);

    slackService.send({
      text: `[<${req.payload.repository.repo_url}|${req.payload.repository.repo_name}>] new image build complete`,
      username: 'DockerHub',
      icon_url: 'https://hooks-slack-dockerhub.herokuapp.com/docker-logo.png'
    }, res);
  }
});

server.start(() => console.log('Server listening on %d', port));
