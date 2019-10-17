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

const SALUTATIONS = [
    "Hello",
    "Whats the deal",
    "What up",
    "How's it going",
    "Say",
    "Whats crack-a-lackin",
    "Pull my finger",
    "WAAAAAZZZZUPPPP"
];

const RANDOM_WELCOME = () => SALUTATIONS[Math.random() * SALUTATIONS.length]

async function botResponse(jsonResponse) {
    try {
        await fetch("https://slack.com/api/chat.postMessage", {
            method: 'POST',
            headers: {
                'Content-type': "application/json",
                'Authorization': `Bearer ${config.slack.botOAuthAccessToken}`
            },
            body: JSON.stringify(jsonResponse),
        });
    } catch (err) {
        console.log("Something went wrong!", err);
    }
}

async function getRandomSubredditPost(subreddit) {
    try {
        let res = await fetch(`https://www.reddit.com/r/${subreddit}/random.json`);
        let json = await res.json();
        let posts = json.data.children;
        return posts[Math.floor(Math.random() * posts.length)];
    } catch (err) {
        throw err;
    }
}

function getRandomCat(callback) {
    getRandomSubredditPost('cats')
        .then(r => {
            if (r.data.url.endsWith("jpg")) {
                callback(r.data.url)
            } else {
                getRandomCat();
            }
        });
}

function getRandomTitties(callback) {
    getRandomSubredditPost('tits')
        .then(r => {
            callback(r.data.url);      
        });
}


/**
 * @route /events
 * @description handles bot events for BobbyBot
 */
router.post('/', (req, res, next) => {
    res.status(200).end(); // Have to send 200 within 3000ms

    if (req.body.event.type === "app_mention") {
        if (req.body.event.text === "<@UPKCHH806> tiddies") {
            getRandomTitties(titty => botResponse({
                "attachments": [{
                    "fallback": titty,
                    "image_url": titty
                }]
            }));
        }
        if (req.body.event.text === "<@UPKCHH806> kitties") {
            getRandomCat(cat => botResponse({
                "attachments": [{
                    "fallback": cat,
                    "image_url": cat
                }]
            }));
        } else {
            botResponse({
                text: `${RANDOM_WELCOME}, <@${req.body.event.user}>!!`,
                channel: req.body.event.channel
            });
        }
    }

    if (req.body.event.type === "message" && req.body.event.text === "BOBBY") {
        botResponse({
            text: `I don't do anything yet, but I am at your service, <@${req.body.event.user}>!!`,
            channel: req.body.event.channel
        });
    }

});

module.exports = router;