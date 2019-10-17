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

function getRandomWelcome(wordList) {
    return wordList[Math.random() * wordList.length]
}

async function botResponse(jsonResponse, channel) {
    try {
        await fetch("https://slack.com/api/chat.postMessage", {
            method: 'POST',
            headers: {
                'Content-type': "application/json",
                'Authorization': `Bearer ${config.slack.botOAuthAccessToken}`
            },
            body: JSON.stringify({ ...jsonResponse, channel }),
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

function getPicFromSubreddit(subreddit, callback) {
    getRandomSubredditPost(subreddit)
        .then(r => {
            r.data.url.endsWith("jpg")
                ? callback(r.data.url)
                : getPicFromSubreddit(subreddit, callback)
        })
        .catch(e => {
            throw e
        });
}

function makeSlackImageAttachment(url, fallback = null) {
    return {
        "attachments": [{
            "fallback": fallback === null ? url : fallback,
            "image_url": url
        }]
    }
}


/**
 * @route /events
 * @description handles bot events for BobbyBot
 */
router.post('/', (req, res, next) => {
    res.status(200).end(); // Have to send 200 within 3000ms

    const constants = {
        CHANNEL: req.body.event.channel
    }

    if (req.body.event.type === "app_mention") {
        if (req.body.event.text === "<@UPKCHH806> tiddies") {
            getPicFromSubreddit('tits', tit => {
                botResponse(makeSlackImageAttachment(tit), constants.CHANNEL)
            });
        } else if (req.body.event.text === "<@UPKCHH806> kitties") {
            getPicFromSubreddit('cats', cat => {
                botResponse(makeSlackImageAttachment(cat), constants.CHANNEL)
            });
        } else {
            botResponse({
                text: `${getRandomWelcome(SALUTATIONS)}, <@${req.body.event.user}>!!`,
                channel: constants.CHANNEL
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