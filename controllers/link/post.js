/**
 * 
 * Routes for POST /link/__
 * 
 */
'use strict'
const express           = require('express');
const router            = express.Router();
const middleware        = require('../../utils/middleware.js');
const { messageAsJson } = require('../../utils/helper.js');


// Middleware to verify request is from Slack.
// Currently, only set up when POSTing to '/link' routes
router.use(middleware.request.verifySlackRequest);


// ROUTE: /link/new
router.post('/new', (req, res) => {
    const looselyDefinedUrlRegex = RegExp('[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+');
    if (looselyDefinedUrlRegex.test(req.body.text)) {
        let responseMessage = messageAsJson(req.body.text, req.body.channel_id)
        res.status(200).send(JSON.parse(responseMessage));
    } else {
        res.status(200).send(middleware.request.getInvalidUrlResponse());
    }
});


module.exports = router;
