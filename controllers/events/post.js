// Routes for POST /events/__

'use strict'
const express = require('express');
const router = express.Router();
const slack = require('../../utils/slack');
const config = require('../../utils/config');
const fetch = require('node-fetch');
const middleware = require('../../utils/middleware.js');


// Middleware to verify request is from Slack.  
//router.use(middleware.request.verifySlackRequest);



async function handleAppMention(req) {
    try {
        const jsonResponse = {
            text: `Hello <@${req.body.event.user}>!!`,
            channel: req.body.event.channel
        };

        await fetch("https://slack.com/api/chat.postMessage", {
            method: 'POST',
            headers: {
                'Content-type': "application/json",
                'Authorization': `Bearer ${config.slack.botOAuthAccessToken}`
            },
            body: JSON.stringify(jsonResponse),
        })
    } catch (err) {
        console.log("Something went wrong!", err);
    }
}



router.post('/', (req, res, next) => {
    //TODO: https://api.slack.com/docs/message-link-unfurling
    console.log(req.body)
    console.log(req.headers);
    //res.status(200).send(req.body.challenge);
    res.status(200).end(); // Have to send 200 within 3000ms
    if (req.body.event.type === "app_mention") {
        console.log("BOBBY WAS MENTIONED!");
        handleAppMention(req);
    }
});

module.exports = router;