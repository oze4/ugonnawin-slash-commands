// Routes for POST /link/__

'use strict'
const express     = require('express');
const router      = express.Router();
const middleware  = require('../../utils/middleware.js');
const weatherApi  = require('../../utils/weatherapi');
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
    let city = req.body.text.trim();
    weatherApi.getWeatherByCityName(city, (data, err) => {
        if (err) {
            res.status(200).send("Unable to complete that action :cry: " + err);
        } else if (data) {
            res.status(200).send(data);
        } else {
            res.status(200).send("We were unable to get weather info, and we received no errors.. Try again later :cry:");
        }
    })
    let responseUrl = req.body.response_url;
});


module.exports = router;
