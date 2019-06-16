/**
 * 
 * Routes for POST /link/__
 * 
 */
'use strict'
const express    = require('express');
const router     = express.Router();
const middleware = require('../../utils/middleware.js');


// Middleware to verify request is from Slack.
// Currently, only set up when POSTing to '/link' routes
router.use(middleware.request.verifySlackRequest);

router.post('/new', (req, res) => {
    res.status(200).send(req.body.text);
});


module.exports = router;
