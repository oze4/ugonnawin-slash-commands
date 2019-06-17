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

    // Verify we have a URL (this checks if we have periods and at least two characters at the end after 
    //     a period: eg: someWordWithAt.LeastTwoCharsAtE.nd). That would qualify as a URL. We verify the
    //     string has either 'http' or 'https' below, if it doesn't we add 'http' (and let the website)
    //     handle redirection to 'https', if it does. Basically we play it safe.
    const looselyDefinedUrlRegex = RegExp('[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+');
    if (looselyDefinedUrlRegex.test(req.body.text)) {

        // Since we are sending our own POST (have to because we want interactive message)
        //     we need to end the current request. This is best practices.. Notice how we
        //     are not sending a response, we are just ending it - this will prevent slack
        //     from erroring out, and will wait for our response until timeout is reached.
        res.status(200).end();

        let responseUrl = req.body.response_url;
        if (req.body.token != config.slack.verificationToken) {

            // Verify tokens match before we respond.
            res.status(403).send("Access denied");

        } else {

            //TODO: turn this into a helper method
            let isValidUrl = req.body.text.startsWith("http://") || req.body.text.startsWith("https://");
            let url = isValidUrl ? req.body.text : `http://${req.body.text}`;
            let jsonMessage = {
                "text": "Click button to open URL",
                "attachments": [
                    {
                        "fallback": ""+ url +"",
                        "actions": [
                            {
                                "text": ""+ url +"",
                                "type": "button",
								"url": ""+ url +""
                            }
                        ]
                    }
                ]
            }; //END-TODO: turn this into a helper method

            // Send POST response with buttons (aka interactive message - but this message
            //     is not 'interactive' as defined by Slack).
            helper.responses.sendMessageToSlackResponseURL(responseUrl, jsonMessage);

        }

    } else {

        // If we are not provided a valid URL, get an invalid response and return it
        res.status(200).send(middleware.request.getInvalidUrlResponse());

    }

});


//================================
// ROUTE: /link/interactive 
//================================
router.post('/interactive', (req, res) => {
    //TODO: complete this if we want interactive buttons
    //      https://api.slack.com/tutorials/intro-to-message-buttons
    res.status(400).send("Hmm.. can't find that..");
});


module.exports = router;
