'use strict';

const Hapi = require('hapi');
const roi = require('roi');
const opossum = require('opossum');

const server = new Hapi.Server();
server.connection({
  host: '0.0.0.0',
  port: 8080
});

const tempSvc = process.env.TEMPERATURE_SERVICE || 'http://temperature-service:8080/conditions';
const forecastSvc = process.env.TEMPERATURE_SERVICE || 'http://forecast-service:8080/forecast';

// Add the route
server.route({
  method: 'GET',
  path: '/weather/{q}',
  handler: (request, reply) => {
    roi.get({ endpoint: `${tempSvc}/${request.params.q}?` })
      .then((resp) => reply(resp.body).type('application/json'))
      .catch(reply);
  }
});

// This will enable /status and show information about
// CPU and memory usage.
server.register({
  register: require('hapijs-status-monitor')
});

// This will print all the paths to stdout when the App starts.
server.register({ register: require('blipp')});

// Start the server
server.start((err) => {
  if (err) {
    throw err;
  }
  console.log('Server running at:', server.info.uri);
});
