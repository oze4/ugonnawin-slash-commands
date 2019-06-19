// Routes for POST /link/__

'use strict'
const express     = require('express');
const router      = express.Router();
const middleware  = require('../../utils/middleware.js');
const slack       = require('../../utils/slack');
const validation  = require('../../utils/validation');
const config      = require('../../utils/config.js');


// Middleware to verify request is from Slack.
router.use(middleware.request.verifySlackRequest);


//================================
// ROUTE: /link/new
//================================
router.post('/new', (req, res) => {
    // Replace 2 or more spaces with single space:
    //     str.replace(/\s\s+/g, ' ')

    if (validation.isLooselyDefinedUrl(req.body.text)) {
        // Since we are sending our own POST (have to because we want interactive message)
        //     we need to end the current request. This is best practices.. Notice how we
        //     are not sending a response, we are just ending it - this will prevent slack
        //     from erroring out, and will wait for our response until timeout is reached.
        res.status(200).end();
        // Verify tokens match before we respond.
        if (req.body.token != config.slack.verificationToken) {
            res.status(403).send("Access denied");
        } else {
            slack.api.get.userInfo(req.body.user_id, (userInfo, error) => {
                if (error) {
                    res.status(400).send("Something went wrong! " + error);
                } else {
                    console.log(JSON.parse(userInfo));
                    let user = JSON.parse(userInfo).user;
                    let linkFrom = user.profile.display_name !== '' 
                                    ? user.profile.display_name : user.name !== ''
                                        ? user.name : user.real_name !== ''
                                            ? user.real_name : "-unable to locate user-";
                    let jsonMessage = slack.messageBuilder.linkAsButton(req, `New link from *${linkFrom}*`);
                    // Send POST response with buttons (aka interactive message - but this message
                    //     is not 'interactive' as defined by Slack).
                    slack.api.post.jsonMessage(req.body.response_url, jsonMessage);
                }
            });
        }
    } else {
        // If we are not provided a valid URL, get an invalid response and return it
        res.status(200).send(slack.messageBuilder.invalidUrlResponse());
    }
});


//================================
// ROUTE: /link/interactive 
//================================
router.post('/interactive', (req, res) => {
    console.log("________________________________________________________");
    console.log("Interactive Button Clicked");
    console.log("________________________________________________________");
    res.status(404).send("Hmmm.. can't find that..");
});


module.exports = router;
