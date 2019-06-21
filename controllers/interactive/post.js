// Routes for POST /interactive/__

'use strict'
const express     = require('express');
const router      = express.Router();
const middleware  = require('../../utils/middleware.js');
const slack       = require('../../utils/slack');


// Middleware to verify request is from Slack.
// TODO: NEED TO REFINE THIS VERIFICATION TO ACCOUNT FOR INTERACTIVE REQUESTS
//router.use(middleware.request.verifySlackRequest);


//================================
// ROUTE: /interactive
//================================
router.post('/', (req, res) => {  
    if (req.body.command === "/interactivetest") { 
        res.status(200).end();
        let myOptions = [
            {
                text: "Option 1",
                value: "Option1Value"
            },
            {
                text: "Option 2",
                value: "Option2Value"
            },
            {
                text: "Option 3",
                value: "Option3Value"
            },
            {
                text: "Option 4",
                value: "Option4Value"
            },                        
        ];
        let select = slack.messageBuilder.textWithSelect("Please select an option:", "Locations", myOptions);
        slack.api.post.jsonMessage(req.body.response_url, select);
    } else {
        console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
        console.log(req.body)
        console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");        
    }
});




module.exports = router;
