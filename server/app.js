// Express app configuration

'use strict'
const express    = require('express');
const app        = express();
const config     = require('../utils/config.js');
const helmet     = require('helmet');
const middleware = require('../utils/middleware.js');

// Set up controllers for routes
const LinkController        = require('../controllers/link');
const EventsController      = require('../controllers/events');
const WeatherController     = require('../controllers/weather');
const InteractiveController = require('../controllers/interactive');
const MyIPController        = require('../controllers/myip');


// set up body parsing and url parsing tools
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Set the port for our application
app.set('port', config.app.port);

// Harden our apps headers
app.use(helmet());

// Log all request headers and body to console (better than nothing I guess)
app.use(middleware.logger.headersAndbody);

// Set up routes for our app
app.use('/link', LinkController);
app.use('/events', EventsController);
app.use('/weather', WeatherController);
app.use('/interactive', InteractiveController);
app.use('/myip', MyIPController);



// Set up 404 middleware - MUST BE LAST as far as routes are concerned
app.use(middleware.route.status.fourzerofour);
module.exports = app;
