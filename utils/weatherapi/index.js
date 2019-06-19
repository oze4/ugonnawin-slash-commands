// https://rapidapi.com/onesoft/api/weather-by-ip
//     API to get weather based upon IP address

'use strict'

const request = require('request');
const config  = require('../../utils/config.js');


class WeatherAPI {

    static getWeatherByIp (ipAddress, callback) {
        let getOptions = {
            uri: config.weatherApi.url + "?ip=" + ipAddress,
            method: 'GET',
            headers: { 
                "X-RapidAPI-Host": config.weatherApi.host,
                "X-RapidAPI-Key": config.weatherApi.apiKey
            }
        };
        request(getOptions, (error, res, body) => {
            if (error) {
                callback(null, error);
            } else {
                callback(body, null);
            }
        });
    }
    
}


module.exports = WeatherAPI;
