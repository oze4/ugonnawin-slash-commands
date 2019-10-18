// Main /events route file 
'use strict'
const express     = require('express');
const router      = express.Router();
const eventsPOST  = require('./post.js');

router.use(eventsPOST);

module.exports = router;