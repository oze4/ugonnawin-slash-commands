// https://openweathermap.org/api
//     API to get weather based upon IP address

'use strict'

const request = require('request');
const config  = require('../../utils/config.js');


class WeatherAPI {
    static getCurrentWeather (cityOrZip, callback) {
        request({
            uri: config.weatherApi.baseUrl + "/weather?q=" + cityOrZip + "&appid=" + config.weatherApi.apiKey,
            method: 'GET'
        }, (error, res, body) => {
            if (error) {
                callback(null, error);
            } else {
                callback(body, null);
            }
        });
    }

    static getWeatherIconUrl (icon) {
        // ex: http://openweathermap.org/img/w/02d.png
        return "http://openweathermap.org/img/w/" + icon + ".png";
    }

    static kelvinToFahrenheit(degreesKelvin) {
        try { 
            let result = Number(degreesKelvin) * 9 / 5 - 459.67;
            return result.toFixed(2);
        } catch {
            return 0;
        }
    }
}


module.exports = WeatherAPI;
