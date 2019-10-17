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


async function handleMessage(req, responseText) {
    try {
        const jsonResponse = {
            text: responseText,
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
    res.status(200).end(); // Have to send 200 within 3000ms

    if (req.body.event.type === "app_mention") {
        if (req.body.event.text === "<@UPKCHH806> tiddies") {
            handleMessage(req, `( . Y . )`);
        } else {
            handleAppMention(req);
        }
    }

    if (req.body.event.type === "message" && req.body.event.text === "BOBBY") {
        handleMessage(req, `I don't do anything yet, but I am at your service, <@${req.body.event.user}>!!`);
    }

});

module.exports = router;