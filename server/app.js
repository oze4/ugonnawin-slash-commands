// Express app configuration

'use strict'
const express        = require('express');
const app            = express();
const config         = require('../utils/config.js');
const helmet         = require('helmet');
const middleware     = require('../utils/middleware.js');

// Set up controllers for routes
const LinkController = require('../controllers/link');



// set up body parsing and url parsing tools
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set the port for our application
app.set('port', config.app.port);

// Harden our apps headers
app.use(helmet());

// Log all request headers to console (better than nothing I guess)
app.use(middleware.logger.headers);

// Set up routes for our app
app.use('/link', LinkController);



// Set up 404 middleware - MUST BE LAST as far as routes are concerned
app.use(middleware.route.status.fourzerofour);
module.exports = app;
