const express        = require('express');
const app            = express();
const config         = require('../utils/config.js');
const helmet         = require('helmet');
const middleware     = require('../utils/middleware.js');

// Set up controllers for routes
const LinkController = require('../controllers/links');



// Set the port for our application
app.set('port', config.app.port);

// Harden our apps headers
app.use(helmet());

// Set up routes for our app
app.use('/link', LinkController);



// Set up 404 middleware - MUST BE LAST as far as routes are concerned
app.use(middleware.route.status.fourzerofour);


module.exports = app;