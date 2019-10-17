// Routes for POST /events/__

'use strict'
const express = require('express');
const router = express.Router();
const slack = require('../../utils/slack');
const config = require('../../utils/config');
const request = require('request');
const middleware = require('../../utils/middleware.js');


// Middleware to verify request is from Slack.  
//router.use(middleware.request.verifySlackRequest);


router.post('/', (req, res, next) => {
    //TODO: https://api.slack.com/docs/message-link-unfurling
    console.log(req.body)
    console.log(req.headers);
    //res.status(200).send(req.body.challenge);
    res.status(200).end(); // Have to send 200 within 3000ms
    if (req.body.event.type === "app_mention") {
        request({
            uri: "https://slack.com/api/chat.postMessage",
            method: 'POST',
            headers: {
                'Content-type': contentType,
                'Authorization': `Bearer ${config.slack.oAuthAccessToken}`
            },
            json: {
                text: `Hello <${req.body.event.user}>!!`,
                channel: `${req.body.event.channel}`
            }
        }, (error, res, body) => {
            if (error) {
                res.status(404).send("Something went wrong! " + error);
            }
        })
    }
})


module.exports = router;