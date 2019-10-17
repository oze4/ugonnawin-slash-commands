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

/*
{
    "attachments": [
        {
            "fallback": "Required plain-text summary of the attachment.",
            "author_link": "http://flickr.com/bobby/",
            "author_icon": "http://flickr.com/icons/bobby.jpg",
            "image_url": "https://i.redd.it/7jjdqcck04t31.jpg",
            "thumb_url": "http://example.com/path/to/thumb.png"
        }
    ]
}
*/

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
        .then(r => r.data.url.endsWith("jpg") ? callback(r.data.url) : getRandomCat());
}

/**
 * @route /events
 * @description handles bot events for BobbyBot
 */
router.post('/', (req, res, next) => {
    res.status(200).end(); // Have to send 200 within 3000ms

    if (req.body.event.type === "app_mention") {
        if (req.body.event.text === "<@UPKCHH806> tiddies") {
            botResponse({
                attachments: [
                    {
                        "fallback": "Required plain-text summary of the attachment.",
                        "author_link": "http://flickr.com/bobby/",
                        "author_icon": "http://flickr.com/icons/bobby.jpg",
                        "image_url": "https://i.redd.it/7jjdqcck04t31.jpg",
                        "thumb_url": "http://example.com/path/to/thumb.png"
                    }
                ],
                channel: req.body.event.channel
            })
            //getRandomCat(cat => botResponse(req, cat));
        } else {
            botResponse({ text: `Hello <@${req.body.event.user}>!!`, channel: req.body.event.channel });
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