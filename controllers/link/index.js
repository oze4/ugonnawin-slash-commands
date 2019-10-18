'use strict'
const express = require('express');
const router = express.Router();
const linkPOST = require('./post.js');

router.use(linkPOST);

module.exports = router;