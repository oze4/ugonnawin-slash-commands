// 
// Routes for POST /link/__
//

'use strict'
const express     = require('express');
const router      = express.Router();
const middleware  = require('../../utils/middleware.js');
const resHelper   = require('../../utils/helper.js');
const config      = require('../../utils/config.js');


// Middleware to verify request is from Slack.
// Currently, only set up when POSTing to '/link' routes
router.use(middleware.request.verifySlackRequest);


// ROUTE: /link/new
router.post('/new', (req, res) => {
    const looselyDefinedUrlRegex = RegExp('[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+');
    if (looselyDefinedUrlRegex.test(req.body.text)) {
        // End current request so we can send interactive request
        res.status(200).end();
        // Send interactive request..
        let responseUrl = req.body.response_url;
        if (req.body.token != config.slack.verificationToken) {
            res.status(403).send("Access denied");
        } else {
            let jsonMessage = `
            {
                "text": "Click button to open URL",
                "attachments": [
                    {
                        "fallback": "${String(req.body.text)}",
                        "actions": [
                            {
                                "type": "button",
                                "url": "${req.body.text}"
                            }
                        ]
                    }
                ]
            }
            `;
            var message = {
                "text": "This is your first interactive message",
                "attachments": [
                    {
                        "text": "Building buttons is easy right?",
                        "fallback": "Shame... buttons aren't supported in this land",
                        "callback_id": "button_tutorial",
                        "color": "#3AA3E3",
                        "attachment_type": "default",
                        "actions": [
                            {
                                "name": "yes",
                                "text": "yes",
                                "type": "button",
                                "value": "yes"
                            },
                            {
                                "name": "no",
                                "text": "no",
                                "type": "button",
                                "value": "no"
                            },
                            {
                                "name": "maybe",
                                "text": "maybe",
                                "type": "button",
                                "value": "maybe",
                                "style": "danger"
                            }
                        ]
                    }
                ]
            }
            resHelper.slack.slash.response.sendMessageToSlackResponseURL(responseUrl, jsonMessage);
        }
        /*
        res.setHeader('content-type', 'application/json');
        let responseMessage = resHelper.slack.slash.response.buttonMessage(req.body.text, 'in_channel');
        res.status(200).send(JSON.parse(responseMessage));
        */
    } else {
        res.status(200).send(middleware.request.getInvalidUrlResponse());
    }
});

// ROUTE: /link/interactive
router.post('/interactive', (req, res) => {

});


module.exports = router;
