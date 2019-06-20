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
    let query = req.body.text.trim();
    if (query === "-h") {
        let helpText = "You may search by city name or by ZIP code. \nIf the city or ZIP code provide incorrect data, you may need to specify a *2 character* country code!!\nThe search parameters ARE NOT case sensitive.\nSome examples are below:\n  • /weather 77065,US\n  • /weather Houston\n  • /weather Houston,US"
        slack.api.post.jsonMessage(req.body.response_url, {text: helpText});
    } else { 
        weatherApi.getCurrentWeather(query, (data, err) => {
            if (err) {
                res.status(200).send("Unable to complete that action :cry: " + err);
            } else if (data) {
                try { 
                    let weather = JSON.parse(data);
                    let mainWeather = weather.weather[0];            
                    let weatherInfo = slack.messageBuilder.currentWeather(
                        weather.name, // City name
                        weatherApi.kelvinToFahrenheit(weather.main.temp), // Temp in Fahrenheit
                        mainWeather.description, // Short description of weather
                        weatherApi.getWeatherIconUrl(mainWeather.icon) // Icon representing weather conditions
                    );
                    slack.api.post.jsonMessage(req.body.response_url, weatherInfo);
                } catch {
                    slack.api.post.jsonMessage(req.body.response_url, {text: "Unable to find weather for that location!"});
                }
            } else {
                res.status(200).send("We were unable to get weather info, and we received no errors.. Try again later :cry:");
            }
        });
    }
});


module.exports = router;
