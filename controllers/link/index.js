// Main /link route file - run: "const LinkController = require('./relative/path/controllers/link')"
//     to import all '/link' routes. HTTP methods have been separated into their own files 
//     for organizational purposes.

'use strict'
const express  = require('express');
const router   = express.Router();

// Set up HTTP method specific routes for /links/___
const linkGET  = require('./get.js');
const linkPOST = require('./post.js');


router.use(linkGET);
router.use(linkPOST);


module.exports = router;
