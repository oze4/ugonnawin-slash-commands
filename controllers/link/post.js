'use strict'
const express = require('express');
const router = express.Router();
const middleware = require('../../utils/middleware.js');
const slack = require('../../utils/slack');
const validation = require('../../utils/validation');

router.use(middleware.request.verifySlackRequest);


/**
 * @route /link/text
 * @description This was built to prevent links from unfurling (showing a preview of the site when you pasted a link). 
 *              This will return a plain-text URL representation of the link that is supplied as a parameter.
 * @example in Slack: /l google.com
 * @example in Slack: /link google.com
 */
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


/**
 * @route /link/button
 * @description Same thing as /link/text but instead of returning a plain-text based URL (link without the unfurling), we return
 *                a button that you can click to open the link. This was built to make it more obvious/add a little spice to this idea. 
 * @example in Slack: /lb google.com
 */
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