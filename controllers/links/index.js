const express = require('express');
const router  = express.Router();

// Set up HTTP method specific routes for /links/___
const linksGET  = require('./get.js');
const linksPOST = require('./post.js');


router.use(linksGET);
router.use(linksPOST);


module.exports = router;
