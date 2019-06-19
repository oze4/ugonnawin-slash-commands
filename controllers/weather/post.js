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



/** SLACK EMOJI NAMES
partly_sunny_rain
thunder_cloud_and_rain
rain_cloud
sunny
mostly_sunny
barely_sunny
partly_sunny
cloud
lightning_cloud
 */

 /* SAMPLE OPENWEATHERMAP JSON DATA
 {
   "coord":{
      "lon":-95.37,
      "lat":29.76
   },
   "weather":[
      {
         "id":801,
         "main":"Clouds",
         "description":"few clouds",
         "icon":"02d"
      }
   ],
   "base":"stations",
   "main":{
      "temp":307.19,
      "pressure":1011,
      "humidity":50,
      "temp_min":305.93,
      "temp_max":308.71
   },
   "visibility":16093,
   "wind":{
      "speed":2.6,
      "gust":7.2
   },
   "clouds":{
      "all":20
   },
   "dt":1560968855,
   "sys":{
      "type":1,
      "id":4850,
      "message":0.01,
      "country":"US",
      "sunrise":1560943267,
      "sunset":1560993869
   },
   "timezone":-18000,
   "id":4699066,
   "name":"Houston",
   "cod":200
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
