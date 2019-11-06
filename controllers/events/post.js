'use strict'
const express = require('express');
const router = express.Router();
const middleware = require('../../utils/middleware.js');
const {
    getRandomElementFromArray,
    botResponse,
    getRandomPicFromSubreddit,
    makeSlackImageAttachment,
    isMessageFromSpecificIdAndIncludesSpecificWord,
    salutations,
    slackEventType,
    channel,
    subreddit,
    userID,
} = require('./eventsHelper');

router.use(middleware.request.verifySlackRequest);


/**
 * @route /events
 * 
 * @description Handles bot events for BobbyBot.
 * 
 * @IMPORTANT ** We need the 'challenge' piece enabled - this is because Slack will send a challenge to the URL that **
 *            ** you want to use for the Events API before they enable it. In order to 'pass' the challenge, you simply **
 *            ** have to respond with the challenge they send to you. **
 * 
 */
router.post('/', (req, res, next) => {
    
    if (req.body.challenge) {

        console.log("*".repeat(50));
        console.log("SLACK CHALLENGE RECEIVED");
        console.log("*".repeat(50));
        res.status(200).send(req.body.challenge);

    } else {

        res.status(200).end(); // Have to send 200 within 3000ms

        const event = {
            CHANNEL: req.body.event.channel,
            USER: req.body.event.user,
            TEXT: req.body.event.text,
            TYPE: req.body.event.type,
            BOT_ID: req.body.event.bot_id
        }

        if (event.TYPE === slackEventType.APP_MENTION) {
            const boobieWords = [`tiddies`, `tits`, `boobs`, `titties`];
            const catWords = ["cat", "kittie", "cats", "kitten"];

            if (isMessageFromSpecificIdAndIncludesSpecificWord(userID.BOBBY_BOT, boobieWords, event.TEXT)) {
                getRandomPicFromSubreddit(subreddit.TITS, titty => {
                    botResponse(makeSlackImageAttachment(titty), event.CHANNEL)
                });
            } else if (isMessageFromSpecificIdAndIncludesSpecificWord(userID.BOBBY_BOT, catWords, event.TEXT)) {
                getRandomPicFromSubreddit(subreddit.CATS, cat => {
                    botResponse(makeSlackImageAttachment(cat), event.CHANNEL)
                });
            } else {
                let message = {
                    text: `${getRandomElementFromArray(salutations)}, <@${event.USER}>!!`
                };
                botResponse(message, event.CHANNEL);
            }
        }

        if (event.TYPE === slackEventType.MESSAGE) {
            if (event.CHANNEL === channels.BOBBIES_BOOBIES && !event.BOT_ID) {
                getRandomPicFromSubreddit(subreddits.TITS, titty => {
                    botResponse(makeSlackImageAttachment(titty), event.CHANNEL)
                });
            } else {
                if (event.TEXT === "BOBBY") {
                    let message = {
                        text: `I don't do anything yet, but I am at your service, <@${event.USER}>!!`
                    }
                    botResponse(message, event.CHANNEL);
                }
            }
        }

    }
});

module.exports = router;