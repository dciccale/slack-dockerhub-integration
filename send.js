const https = require('https');

module.exports = (id, params, reply) => {
  const options = {
    method: 'POST',
    hostname: 'hooks.slack.com',
    path: `/services/${id}`,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  let body = '';

  const req = https.request(options, (res) => {
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      body += chunk;
    });
    res.on('end', () => reply(body));
  });

  req.on('error', reply);
  req.write(JSON.stringify(params));
  req.end();
};
