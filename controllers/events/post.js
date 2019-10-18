// Routes for POST /events/__

'use strict'
const express = require('express');
const router = express.Router();
const config = require('../../utils/config');
const fetch = require('node-fetch');
//const middleware = require('../../utils/middleware.js');

/**TODO
 * LOOK INTO WHY REQUEST VALIDATION FAILS FOR BOT REQUESTS
 * - Are they only used for Slash Commands?
 * - How can we validate Bot Requests?
 */
// Middleware to verify request is from Slack.  
//router.use(middleware.request.verifySlackRequest);


function getRandomElementFromArray(arr) {
    return arr[Math.random() * arr.length]
}

function botResponse(jsonResponse, channel) {
    try {
        fetch("https://slack.com/api/chat.postMessage", {
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

async function getRandomPostsFromSubReddit(subreddit) {
    return fetch(`https://www.reddit.com/r/${subreddit}/.json`)
        .then(res => res.json())
        .then(json => getRandomElementFromArray(json.data.children))
        .catch(err => { throw err; });
}

function getRandomPicFromSubreddit(subreddit, callback) {
    getRandomPostsFromSubReddit(subreddit)
        .then(r => {
            r.data.url.endsWith('jpg')
                ? callback(r.data.url)
                : getRandomPicFromSubreddit(subreddit, callback)
        })
        .catch(e => { throw e });
}

function makeSlackImageAttachment(url, fallback = null) {
    return {
        "attachments": [{
            "fallback": fallback === null ? url : fallback,
            "image_url": url
        }]
    }
}

function isTittyEvent(text, id = '<@UPKCHH806>') {
    return [
        `${id} tiddies`,
        `${id} tits`,
        `${id} boobs`,
        `${id} titties`,
    ].includes(text);
}

function isCatEvent(text, id = '<@UPKCHH806>') {
    return [
        `${id} cat`,
        `${id} kittie`,
        `${id} cats`,
        `${id} kitten`,
    ].includes(text);
}

const salutations = [
    "Hello",
    "Whats the deal",
    "What up",
    "How's it going",
    "Say",
    "Whats crack-a-lackin",
    "Pull my finger",
    "WAAAAAZZZZUPPPP"
];

const types = {
    APP_MENTION: "app_mention",
    MESSAGE: "message"
}

const subreddits = {
    TITS: 'tits',
    CATS: 'cats',
}


/**
 * @route /events
 * @description handles bot events for BobbyBot
 */
router.post('/', (req, res, next) => {
    res.status(200).end(); // Have to send 200 within 3000ms

    const event = {
        CHANNEL: req.body.event.channel,
        USER: req.body.event.user,
        TEXT: req.body.event.text,
        TYPE: req.body.event.type,
    }

    if (event.TYPE === types.APP_MENTION) {
        if (isTittyEvent(event.TEXT)) {
            getRandomPicFromSubreddit(subreddits.TITS, titty => {
                botResponse(makeSlackImageAttachment(titty), event.CHANNEL)
            });
        } else if (isCatEvent(event.TEXT)) {
            getRandomPicFromSubreddit(subreddits.CATS, cat => {
                botResponse(makeSlackImageAttachment(cat), event.CHANNEL)
            });
        } else {
            let message = { text: `${getRandomElementFromArray(salutations)}, <@${event.USER}>!!` };
            botResponse(message, event.CHANNEL);
        }
    }

    if (event.TYPE === types.MESSAGE && event.TEXT === "BOBBY") {
        let message = { text: `I don't do anything yet, but I am at your service, <@${event.USER}>!!` }
        botResponse(message, event.CHANNEL);
    }

});

module.exports = router;