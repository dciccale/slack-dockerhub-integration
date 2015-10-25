'use strict';

var http = require('https');

function SlackService(options) {
  if (!options || !options.id) {
    throw new Error('The slack webhook id is required');
  }

  this.options = options;
}

SlackService.prototype.send = function (params, cb) {
  var options = {
    method: 'POST',
    hostname: 'hooks.slack.com',
    path: '/services/' + this.options.id,
    headers: {
      'Content-Type': 'application/json',
    }
  };

  var body = '';

  var req = http.request(options, function (res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      body += chunk;
    });
    res.on('end', function () {
      cb(body);
    });
  });

  req.on('error', cb);
  req.write(JSON.stringify(params));
  req.end();
};

module.exports = SlackService;
