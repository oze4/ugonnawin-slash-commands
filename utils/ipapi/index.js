// IPAPI.co api

'use strict'
const request = require('request');
const config  = require('../../utils/config.js');


class IpApi {
    static getCoordinates (ipAddress, callback) {
        let url = config.ipApi.baseUrl + "/" + ipAddress;
        let getOptions = {
            uri: url,
            method: 'GET',
        };
        request(getOptions, (error, res, body) => {
            if (error) {
                callback(null, error);
            }
            if (body) {
                callback(body, null);
            }
        })
    }
}


module.exports = IpApi;
