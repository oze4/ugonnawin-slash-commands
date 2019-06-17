/**
 * 
 * Routes for POST /link/__
 * 
 */
'use strict'
const express     = require('express');
const router      = express.Router();
const middleware  = require('../../utils/middleware.js');
const resHelper   = require('../../utils/helper.js');


// Middleware to verify request is from Slack.
// Currently, only set up when POSTing to '/link' routes
router.use(middleware.request.verifySlackRequest);


// ROUTE: /link/new
router.post('/new', (req, res) => {
    const looselyDefinedUrlRegex = RegExp('[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+');
    if (looselyDefinedUrlRegex.test(req.body.text)) {
        res.setHeader('content-type', 'application/json');
        let responseMessage = resHelper.slack.slash.response.buttonMessage(req.body.text, 'in_channel');
        res.status(200).send(JSON.parse(responseMessage));
    } else {
        res.status(200).send(middleware.request.getInvalidUrlResponse());
    }
});


module.exports = router;
