'use strict'
const express = require('express');
const router = express.Router();
const weatherPOST = require('./post.js');

router.use(weatherPOST);

module.exports = router;