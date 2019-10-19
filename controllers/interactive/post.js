'use strict'
const express     = require('express');
const router      = express.Router();
const middleware  = require('../../utils/middleware.js');
const slack       = require('../../utils/slack');
const weatherApi  = require('../../utils/weatherapi');

router.use(middleware.request.verifySlackRequest);


/**
 * @route /interactive
 * 
 * @description This is used for Block Messages and Interactivity. 
 *              For example, when you supply a Block Message that has a drop down, or has a voting button, etc.. 
 *                this is the route that handles what the user has chosen, etc..
 */
router.post('/', (req, res) => {  
    if (req.body.command === "/interactivetest") {         
        res.status(200).end();
    } else if (req.body.payload) {
        let payLoad = JSON.parse(req.body.payload);
        let userQuery = payLoad.actions[0].selected_option.value;
        weatherApi.getCurrentWeather(userQuery, "id", (data, err) => {
            res.status(200).end();
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
    } else {
        res.status(200).end(); // Have to send 200 within 3000ms
    }
});




module.exports = router;
