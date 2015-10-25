'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var fs = require('fs');
var qs = require('querystring');
var Hapi = require('hapi');
var inert = require('inert');
var marked = require('marked');

var SlackService = require('./slack.service.js');

var server = new Hapi.Server();
var port = process.env.PORT || 8080;

server.connection({port: port});
server.register(inert, function () {});

server.route({
  method: 'GET',
  path:'/{param*}',
  handler: function (req, res) {
    fs.readFile(__dirname + '/README.md', 'utf8', function (err, content) {
      if (err) {
        return res(err);
      }
      res(marked(content));
    });
  }
});

server.route({
  method: 'GET',
  path: '/docker-logo.png',
  handler: function (req, res) {
    res.file(__dirname + '/docker-logo.png');
  }
});

server.route({
  method: 'POST',
  path:'/{id*}',
  handler: function (req, res) {
    var slackService = new SlackService(req.params);

    slackService.send({
      text: 'Hello World!',
      username: 'DockerHub',
      icon_url: server.info.uri + '/docker-logo.png'
    }, res);
  }
});

server.start(function () {
  console.log('Server listening on %d', port);
});
