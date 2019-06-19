// Routes for POST /link/__

'use strict'
const express     = require('express');
const router      = express.Router();
const middleware  = require('../../utils/middleware.js');
const helper      = require('../../utils/helper.js')
const config      = require('../../utils/config.js');


// Middleware to verify request is from Slack.  
// Currently, only set up when POSTing to '/link' routes.
router.use(middleware.request.verifySlackRequest);


//================================
// ROUTE: /link/new
//================================
router.post('/new', (req, res) => {
    // Replace 2 or more spaces with single space:
    //     str.replace(/\s\s+/g, ' ')

    if (helper.validation.isLooselyDefinedUrl(req.body.text)) {
        // Since we are sending our own POST (have to because we want interactive message)
        //     we need to end the current request. This is best practices.. Notice how we
        //     are not sending a response, we are just ending it - this will prevent slack
        //     from erroring out, and will wait for our response until timeout is reached.
        res.status(200).end();
        // Verify tokens match before we respond.
        if (req.body.token != config.slack.verificationToken) {
            res.status(403).send("Access denied");
        } else {
            helper.http.get.getSlackUserInfo(req.body.user_id, (userInfo, error) => {
                if (error) {
                    res.status(400).send("Something went wrong! " + error);
                } else {
                    let jsonMessage = helper.slack.messages.newUrlToButtonMessage(req, `New link from *${userInfo.user.profile.user_name}*`);
                    // Send POST response with buttons (aka interactive message - but this message
                    //     is not 'interactive' as defined by Slack).
                    helper.http.post.sendMessageToSlackResponseURL(req.body.response_url, jsonMessage);
                }
            });
        }
    } else {
        // If we are not provided a valid URL, get an invalid response and return it
        res.status(200).send(helper.slack.messages.getInvalidUrlResponse());
    }
});


//================================
// ROUTE: /link/interactive 
//================================
router.post('/interactive', (req, res) => {
    console.log("________________________________________________________");
    console.log("Interactive Button Clicked");
    console.log("________________________________________________________");
    // if (req.body.callback)
    if (helper.validation.isLooselyDefinedUrl(req.body.text)) {
        // Since we are sending our own POST (have to because we want interactive message)
        //     we need to end the current request. This is best practices.. Notice how we
        //     are not sending a response, we are just ending it - this will prevent slack
        //     from erroring out, and will wait for our response until timeout is reached.
        res.status(200).end();
        // Verify tokens match before we respond.
        if (req.body.token != config.slack.verificationToken) {
            res.status(403).send("Access denied");
        } else {
            helper.http.getSlackUserDisplayNameFromId(req.body.user_id, (displayName, error) => {
                if (error) {
                    res.status(400).send("Something went wrong! " + error);
                } else {
                    let jsonMessage = helper.responses.newUrlToButtonMessage(req, `New link from *${displayName}*`);
                    // Send POST response with buttons (aka interactive message - but this message
                    //     is not 'interactive' as defined by Slack).
                    helper.http.sendMessageToSlackResponseURL(req.body.response_url, jsonMessage);
                }
            });
        }
    }
});


module.exports = router;
