// https://rapidapi.com/onesoft/api/weather-by-ip
//     API to get weather based upon IP address

'use strict'

const request = require('request');
const config  = require('../../utils/config.js');


class WeatherAPI {
    urlSuffix = "weather?lat=35&lon=139&appid=b6907d289e10d714a6e88b30761fae22";
    static getWeatherByLatLon (lat, lon, callback) {
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
