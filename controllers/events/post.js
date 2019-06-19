// Routes for POST /events/__

'use strict'
const express     = require('express');
const router      = express.Router();
const middleware  = require('../../utils/middleware.js');
const helper      = require('../../utils/helper.js')
const config      = require('../../utils/config.js');


// Middleware to verify request is from Slack.  
router.use(middleware.request.verifySlackRequest);


// ===========================
// Route: POST /events
// ===========================
// NOTE: THIS HAS TO BE HERE!!! DO NOT REMOVE THIS ROUTE!!
// SLACK WILL SEND A CHALLENGE TO THIS ENDPOINT AND WE HAVE TO 
// RESPOND WITH THE CHALLENGE VALUE.
router.post('/', (req, res, next) => {
    //TODO: https://api.slack.com/docs/message-link-unfurling
    res.status(200).send(req.body.challenge);
})


module.exports = router;
