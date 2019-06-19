// Main /events route file 

'use strict'
const express     = require('express');
const router      = express.Router();
// Set up HTTP method specific routes for /events/___
const eventsPOST  = require('./post.js');


router.use(eventsPOST);


module.exports = router;
