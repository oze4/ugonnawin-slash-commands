// Routes for POST /events/__

'use strict'
const express     = require('express');
const router      = express.Router();
const middleware  = require('../../utils/middleware.js');
const helper      = require('../../utils/helper.js')
const config      = require('../../utils/config.js');


// Middleware to verify request is from Slack.  
//router.use(middleware.request.verifySlackRequest);


// ===========================
// Route: POST /events
// ===========================
router.post('/events', (req, res, next) => {
    console.log("CHALLENGE: " + req.body.challenge);
    res.status(200).send(req.body.challenge);
})


module.exports = router;
