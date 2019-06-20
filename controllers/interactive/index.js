// Main /interactive route file

'use strict'
const express         = require('express');
const router          = express.Router();
const interactivePOST = require('./post.js');


router.use(interactivePOST);


module.exports = router;
