// Routes for POST /link/__

'use strict'
const express     = require('express');
const router      = express.Router();
const middleware  = require('../../utils/middleware.js');
const weatherApi  = require('../../utils/weatherapi');
const ipApi       = require('../../utils/ipapi');
const slack       = require('../../utils/slack');
const validation  = require('../../utils/validation');
const config      = require('../../utils/config.js');


// Middleware to verify request is from Slack.
router.use(middleware.request.verifySlackRequest);

/* Sample weather response:
{
    "weather":{
        "condition":"Clear"
        "description":"Sky is Clear"
    }
    "main":{
        "temp":23.843
        "temp_min":23.843
        "temp_max":23.843
        "pressure":1018.12
        "sea_level":1029.03
        "humidity":73
    }
    "wind":{
        "speed":2.07
        "degree":348
    }
    "location":{
        "country":"United States"
        "city":"Ashburn"
        "ip":"54.86.225.32"
    }
}
*/


//================================
// ROUTE: /weather
//================================
router.post('/', (req, res) => {
    let ip = req.headers['x-real-ip'];
    console.log("IP: " + ip)
    let responseUrl = req.body.response_url;
    ipApi.getCoordinates(ip, (ipData, err) => {
        if (err) {
            console.log(err);
            res.status(404).send(err);
        }
        if (ipData) {
            console.log(ipData);
            res.status(200).send(ipData);
        }
    })
});


module.exports = router;
