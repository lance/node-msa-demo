'use strict';

const Hapi = require('hapi');
const roi = require('roi');
const opossum = require('opossum');
const querystring = require('querystring');

// Open Weather Map API key and base URL
const apiKey = process.env.OPENWEATHER_API_KEY || 'NO_API_KEY';
const serviceUrl = 'http://api.openweathermap.org/data/2.5/weather';

// Create a simple Hapi server
// TODO: is this overkill? Or just boring?
// What about either straight up Node.js http
// or something more complex like seneca.js
const server = new Hapi.Server();
server.connection({
  host: '0.0.0.0',
  port: 8080
});

// Add the route
server.route({
  method: 'GET',
  path: '/conditions/{q}',
  handler: (request, reply) =>
    fetchConditions(request.params.q)
      .then((response) => reply(response).type('application/json'))
      .catch(reply)
});

// This will enable /status and show information about
// CPU and memory usage.
server.register({
  register: require('hapijs-status-monitor')
});

// This will print all the paths to stdout when the App starts.
server.register({ register: require('blipp')});


// Fetches current condition weather data
// from openweathermap.org.
// The `q` parameter can be a zip code
// or city name
const fetchConditions = (q) =>
  roi.get(roiOptions(q))
    .then((resp) => resp.body)
    .catch(console.error);

// Utility function to construct an options
// object for roi.get
const roiOptions = (q) => ({
    endpoint: `${serviceUrl}?${querystring.stringify({
    q: q, appid: apiKey, units: 'imperial'
  })}`})

// Start the server
server.start((err) => {
  if (err) {
    throw err;
  }
  console.log('Server running at:', server.info.uri);
});
