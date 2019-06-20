// Routes for POST /weather/__

'use strict'
const express     = require('express');
const router      = express.Router();
const middleware  = require('../../utils/middleware.js');
const weatherApi  = require('../../utils/weatherapi');
const slack       = require('../../utils/slack');


// Middleware to verify request is from Slack.
router.use(middleware.request.verifySlackRequest);


//================================
// ROUTE: /weather
//================================
router.post('/', (req, res) => {
    res.status(200).end(); // Have to send 200 within 3000ms
    let city = req.body.text.trim();
    weatherApi.getWeatherByCityName(city, (data, err) => {
        if (err) {
            res.status(200).send("Unable to complete that action :cry: " + err);
        } else if (data) {
            let weather = JSON.parse(data);
            console.log(weather.main);
            let weatherInfo = slack.messageBuilder.currentWeather(
                    weather.name, 
                    weatherApi.kelvinToFahrenheit(weather.main.temp), 
                    weather.weather.description,
                    weatherApi.getWeatherIconUrl(weather.weather.icon)
                );
            console.log('weatherinfo:');
            console.log(weatherInfo);
            slack.api.post.jsonMessage(req.body.response_url, weatherInfo);
        } else {
            res.status(200).send("We were unable to get weather info, and we received no errors.. Try again later :cry:");
        }
    })
});


module.exports = router;
