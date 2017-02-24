'use strict';

const Hapi = require('hapi');
const roi = require('roi');
const opossum = require('opossum');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
  host: 'localhost',
  port: 8080
});

// Add the route
server.route({
  method: 'GET',
  path: '/weather/{q}',
  handler: (request, reply) => reply(request.params.q)
});

// Start the server
server.start((err) => {
  if (err) {
    throw err;
  }
  console.log('Server running at:', server.info.uri);
});
