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


/*
 *         /link/new
 */
router.post('/new', (req, res) => {
    const looselyDefinedUrlRegex = RegExp('[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+');
    let resText = looselyDefinedUrlRegex.test(req.body.text) 
        // If we were sent a valid URL
        ? req.body.text
        // If we were not sent a valid URL get a random response
        : middleware.request.getInvalidUrlResponse()
    res.status(200).send(resText);
});


module.exports = router;
