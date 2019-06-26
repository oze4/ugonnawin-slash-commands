//// For getting your public ip

'use strict'
const express  = require('express');
const router   = express.Router();
// Set up HTTP method specific routes for /links/___
const myipGET  = require('./get.js');


router.use(myipGET);


module.exports = router;
