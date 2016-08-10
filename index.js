'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const https = require('https');
const fs = require('fs');
const Hapi = require('hapi');
const inert = require('inert');
const marked = require('marked');

const server = new Hapi.Server();
const port = process.env.PORT || 8080;

server.connection({port: port});
server.register(inert, () => {});

const readme = fs.readFileSync(`${__dirname}/README.md`, 'utf8');
const docs = marked(readme);

server.route({
  method: 'GET',
  path: '/{param*}',
  handler: (req, reply) => reply(docs)
});

server.route({
  method: 'GET',
  path: '/docker-logo.png',
  handler: (req, reply) => reply.file(`${__dirname}/docker-logo.png`)
});

server.route({
  method: 'POST',
  path: '/services/{id*}',
  handler: (req, reply) => {
    const params = {
      text: `[<${req.payload.repository.repo_url}|${req.payload.repository.repo_name}>] new image build complete`,
      username: 'DockerHub',
      icon_url: 'https://hooks-slack-dockerhub.herokuapp.com/docker-logo.png'
    };

    const options = {
      method: 'POST',
      hostname: 'hooks.slack.com',
      path: `/services/${req.params.id}`,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    let body = '';

    https.request(options, (res) => {
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => reply(body));
    })
    .on('error', reply)
    .write(JSON.stringify(params))
    .end();
  }
});

server.start(() => console.log('Server listening on %d', port));
