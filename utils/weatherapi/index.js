// https://openweathermap.org/api
//     API to get weather based upon IP address

'use strict'

const request = require('request');
const config  = require('../../utils/config.js');


class WeatherAPI {

    /**
     * @param  {String} cityOrZip
     * @param  {String} queryType - can either be weather, find, or id
     * @param  {Function(result, error)} callback
     */
    static getCurrentWeather (cityOrZip, queryType, callback) {
        if (!['weather', 'find', 'id'].includes(queryType)) {
            throw "queryType parameter is wrong! Has to be either 'weather','find', or 'id'!";
        } else { 
            let urlParam = multi ? "/find?q=" : "/weather?q=";
            let url = config.weatherApi.baseUrl + urlParam + cityOrZip + "&appid=" + config.weatherApi.apiKey
            request({
                uri: url,
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
