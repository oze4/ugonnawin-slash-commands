'use strict'
const express = require('express');
const app = express();
const helmet = require('helmet');
const middleware = require('../utils/middleware.js');

// Controllers
const LinkController = require('../controllers/link');
const EventsController = require('../controllers/events');
const WeatherController = require('../controllers/weather');
const InteractiveController = require('../controllers/interactive');
const MyIPController = require('../controllers/myip');
const DBController = require('../controllers/db');

// set up body parsing and url parsing tools
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Set the port for our application
app.set('port', process.env.PORT);

// Harden our apps headers
app.use(helmet());

// Adds a req.rawBody property on all requests
app.use(middleware.request.addRawBody);
// Log all request headers and body to console (better than nothing I guess)
app.use(middleware.logger.headersAndbody);

// Set up routes for our app
app.use('/link', LinkController);
app.use('/events', EventsController);
app.use('/weather', WeatherController);
app.use('/interactive', InteractiveController);
app.use('/myip', MyIPController);
app.use('/db', DBController);

// Set up 404 middleware - MUST BE LAST as far as routes are concerned
app.use(middleware.route.status.fourzerofour);

module.exports = app;
