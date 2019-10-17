// Routes for POST /events/__

'use strict'
const express = require('express');
const router = express.Router();
const slack = require('../../utils/slack');
const config = require('../../utils/config');
const fetch = require('node-fetch');
const middleware = require('../../utils/middleware.js');

/**TODO
 * LOOK INTO WHY REQUEST VALIDATION FAILS FOR BOT REQUESTS
 * - Are they only used for Slash Commands?
 * - How can we validate Bot Requests?
 */
// Middleware to verify request is from Slack.  
//router.use(middleware.request.verifySlackRequest);

async function botResponse(req, responseText) {
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

async function getRandomSubredditPost(subreddit) {
    try {
        let res = await fetch(`https://www.reddit.com/r/${subreddit}/random.json`)
        let json = await res.json();
        let count = json.data.children.length;
        let random = Math.floor(Math.random() * count);
        return json.data.children[random]
    } catch (err) {
        throw err;
    }
}

function getRandomCat() {
    let post = getRandomSubredditPost("cats");
    return post.data.thumbnail
}

/**
 * @route /events
 * @description handles bot events for BobbyBot
 */
router.post('/', (req, res, next) => {
    res.status(200).end(); // Have to send 200 within 3000ms

    if (req.body.event.type === "app_mention") {
        if (req.body.event.text === "<@UPKCHH806> tiddies") {
            botResponse(req, getRandomCat());
        } else {
            botResponse(req, `Hello <@${req.body.event.user}>!!`);
        }
    }

    if (req.body.event.type === "message" && req.body.event.text === "BOBBY") {
        botResponse(req, `I don't do anything yet, but I am at your service, <@${req.body.event.user}>!!`);
    }

});

module.exports = router;