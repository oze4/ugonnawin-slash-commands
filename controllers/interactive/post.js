// Routes for POST /interactive/__

'use strict'
const express     = require('express');
const router      = express.Router();
const middleware  = require('../../utils/middleware.js');
const slack       = require('../../utils/slack');
const weatherApi  = require('../../utils/weatherapi');


// Middleware to verify request is from Slack.
router.use(middleware.request.verifySlackRequest);


//================================
// ROUTE: /interactive
//================================
router.post('/', (req, res) => {  
    res.status(200).end();
    if (req.body.command === "/interactivetest") {         

    } else if (req.body.payload) {
        let payLoad = JSON.parse(req.body.payload);
        let userQuery = payLoad.actions[0].selected_option.value;
        weatherApi.getCurrentWeather(userQuery, "id", (data, err) => {
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
                        weatherApi.getWeatherIconUrl(mainWeather.icon), // Icon representing weather conditions
                    );
                    slack.api.post.jsonMessage(payLoad.response_url, weatherInfo);
                } catch (tryerr) {
                    slack.api.post.jsonMessage(payLoad.response_url, {text: "Unable to find weather for that location! " + tryerr});
                }
            } else {
                res.status(200).send("We were unable to get weather info, and we received no errors.. Try again later :cry:");
            }
        });
    }
});




module.exports = router;
