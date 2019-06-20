// https://openweathermap.org/api
//     API to get weather based upon IP address

'use strict'

const request = require('request');
const config  = require('../../utils/config.js');


class WeatherAPI {
    static getWeatherByCityName (city, callback) {
        request({
            uri: config.weatherApi.url + "/weather?q=" + city + "&appid=" + config.weatherApi.apiKey,
            method: 'GET'
        }, (error, res, body) => {
            if (error) {
                callback(null, error);
            } else {
                callback(body, null);
            }
        });
    }

}


module.exports = WeatherAPI;
