// Main /weather route file

'use strict'
const express     = require('express');
const router      = express.Router();
// Set up HTTP method specific routes for /weather/___
const weatherPOST = require('./post.js');


router.use(weatherPOST);


module.exports = router;
