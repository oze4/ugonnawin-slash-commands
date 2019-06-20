// Routes for POST /interactive/__

'use strict'
const express     = require('express');
const router      = express.Router();
const middleware  = require('../../utils/middleware.js');
const slack       = require('../../utils/slack');


// Middleware to verify request is from Slack.
router.use(middleware.request.verifySlackRequest);


//================================
// ROUTE: /interactive
//================================
router.post('/', (req, res) => {  
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")  
    /*
    console.log("________________________________________________________");
    console.log("Interactive Button Clicked");
    console.log("________________________________________________________");
    let responseUrl = req.body.response_url;
    console.log(responseUrl);
    let json = {
        text: "Thanks for clicking!"
    };
    let jsonMessage = JSON.parse(json);
    res.status(200).end();
    slack.api.post.jsonMessage(responseUrl, jsonMessage);
    */
});


module.exports = router;
