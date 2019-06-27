// Routes for POST /weather/__

'use strict'
const express     = require('express');
const router      = express.Router();
const middleware  = require('../../utils/middleware.js');
const weatherApi  = require('../../utils/weatherapi');
const slack       = require('../../utils/slack');
const textHelper  = require('../../utils/text');


// Middleware to verify request is from Slack.
router.use(middleware.request.verifySlackRequest);


//================================
// ROUTE: /weather
//================================
router.post('/', (req, res) => {
    let query = req.body.text.trim();

    if (query === "-h" || query === "-help") {

        res.status(200).end(); // Have to send 200 within 3000ms
        let helpText = "==========================================\n\n" +
        "  ---- *`"+ query +"` README* ----\n\n- You may search by city name or by ZIP code. \n\n" +
        "- If the city or ZIP code provide incorrect data, you may need to specify a *2 character* country code!!\n\n" +
        "- The search parameters ARE NOT case sensitive.\n\n" + 
        "- Examples:\n" +
        "  • `/weather -a Houston` *(returns select box of all 'Houston' locations found)*\n" +
        "  • `/weather 77065,US` *(comma without a space is required when specifying country code!!)*\n" +
        "  • `/weather Houston`\n" +
        "  • `/weather 77065`\n" +
        "  • `/weather Houston,US`\n\n" +
        "=========================================="
        slack.api.post.jsonMessage(req.body.response_url, {text: helpText});

    } else if (query.startsWith("-a")) {

        let qry = textHelper.replaceMultipleSpacesWithSingleSpace(query);
        let userQuery = qry.split(' ').slice(1, qry.length).join(' ');
        //let userQuery = qry.split(' ').slice(-1)[0]
        weatherApi.getCurrentWeather(userQuery, 'find', (data, err) => {
            if (err) { 
                res.status(200).send("Unable to complete that action :cry: " + err);
            } else if (data) {
                res.status(200).end(); // Have to send 200 within 3000ms
                try {
                    let allWeather = JSON.parse(data);
                    // If the request was valid - the third party weather api sends this property for us to check
                    if (allWeather.message === "accurate") {
                        let allLocations = allWeather.list.map(location => {
                            return {
                                text: location.name + " (lat: " + location.coord.lat + ", lon: " + location.coord.lon + ")",
                                value: String(location.id)
                            }
                        });
                        let jsonMessage = slack.messageBuilder.textWithSelect("Please select a Location", "Locations", allLocations);
                        slack.api.post.jsonMessage(req.body.response_url, jsonMessage);
                    } else {
                        slack.api.post.jsonMessage(req.body.response_url, {text: "Unable to find weather for that location!\n _*Please use `/weather -help` for help!*_"});
                    }
                } catch {
                    slack.api.post.jsonMessage(req.body.response_url, {text: "Unable to find weather for that location!\n _*Please use `/weather -help` for help!*_"});
                }
            } else {
                res.status(200).send("We were unable to get weather info, and we received no errors.. Try again later :cry:\n _*Please use `/weather -help` for help!*_");
            }
        })

    } else { 

        res.status(200).end(); // Have to send 200 within 3000ms
        weatherApi.getCurrentWeather(query, 'weather', (data, err) => {
            if (err) {
                res.status(200).send("Unable to complete that action :cry: " + err);
            } else if (data) {
                try { 
                    let weather = JSON.parse(data);
                    let multipleLocationsFoundWarning = "*If location is incorrect you need to supply a Country Code.* `/weather -help` for help";
                    let mainWeather = weather.weather[0];            
                    let weatherInfo = slack.messageBuilder.currentWeather(
                        weather.name, // City name
                        weatherApi.kelvinToFahrenheit(weather.main.temp), // Temp in Fahrenheit
                        mainWeather.description, // Short description of weather
                        weatherApi.getWeatherIconUrl(mainWeather.icon), // Icon representing weather conditions
                        multipleLocationsFoundWarning // Any extra text - as a 'context block' https://api.slack.com/reference/messaging/blocks#context
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
