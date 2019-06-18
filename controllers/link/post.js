// Routes for POST /link/__

'use strict'
const express     = require('express');
const router      = express.Router();
const middleware  = require('../../utils/middleware.js');
const helper      = require('../../utils/helper.js');
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
        let responseUrl = req.body.response_url;
        // Verify tokens match before we respond.
        if (req.body.token != config.slack.verificationToken) {
            res.status(403).send("Access denied");
        } else {
            //TODO: NEED TO FIX THIS ////////////////////////////////////////////////////////////////
            let userDisplayName = helper.http.getSlackUserDisplayNameFromId(req.body.user_id);
            /////////////////////////////////////////////////////////////////////////////////////////
            console.log(userDisplayName)
            // FOR NOW JUST USE USERNAME
            let jsonMessage = helper.responses.newUrlToButtonMessage(req, `New link from: ${userDisplayName}`);
            // Send POST response with buttons (aka interactive message - but this message
            //     is not 'interactive' as defined by Slack).
            helper.http.sendMessageToSlackResponseURL(responseUrl, jsonMessage);
        }
    } else {
        // If we are not provided a valid URL, get an invalid response and return it
        res.status(200).send(helper.responses.getInvalidUrlResponse());
    }
});


//================================
// ROUTE: /link/interactive 
//================================
router.post('/interactive', (req, res) => {
    //TODO: complete this if we want interactive buttons
    //      https://api.slack.com/tutorials/intro-to-message-buttons
    res.status(404).send("Hmm.. can't find that..");
});


module.exports = router;
