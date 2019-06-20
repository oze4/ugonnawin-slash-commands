// Routes for POST /link/__

'use strict'
const express     = require('express');
const router      = express.Router();
const middleware  = require('../../utils/middleware.js');
const slack       = require('../../utils/slack');
const validation  = require('../../utils/validation');
const config      = require('../../utils/config.js');


// Middleware to verify request is from Slack.
router.use(middleware.request.verifySlackRequest);


//================================
// ROUTE: /link/text
//================================
router.post('/text', (req, res) => {
    if (validation.isLooselyDefinedUrl(req.body.text)) {
        res.status(200).end(); // Have to send 200 within 3000ms
        slack.api.get.userName(req.body.user_id, (userName, error) => {
            if (error) {
                res.status(404).send("Something went wrong! " + error);
            } else if (userName) {
                let jsonMessage = slack.messageBuilder.textToLink(req, "New link from *" + userName + "*");
                slack.api.post.jsonMessage(req.body.response_url, jsonMessage);
            } else {
                res.status(200).send("Something went wrong :cry: Try again later");
            }
        });
    } else {
        // If we are not provided a valid URL, get an invalid response and return it
        res.status(200).send(slack.messageBuilder.invalidUrlResponse());
    }
});


//================================
// ROUTE: /link/button
//================================
router.post('/button', (req, res) => {
    if (validation.isLooselyDefinedUrl(req.body.text)) {
        res.status(200).end(); // Have to send 200 within 3000ms
        slack.api.get.userName(req.body.user_id, (userName, error) => {
            if (error) {
                res.status(404).send("Something went wrong! " + error);
            } else if (userName) {
                let jsonMessage = slack.messageBuilder.linkWithButton(req, "New link from " + userName);
                slack.api.post.jsonMessage(req.body.response_url, jsonMessage);
            } else {
                res.status(200).send("Something went wrong :cry: Try again later");
            }
        });
    } else {
        // If we are not provided a valid URL, get an invalid response and return it
        res.status(200).send(slack.messageBuilder.invalidUrlResponse());
    }
});


module.exports = router;
