//

'use strict'
const request = require('request');
const config  = require('../../utils/config.js');


const httpGet = {
    getSlackUserInfo: (user_id, callback) => {
        request({
            uri: "https://slack.com/api/users.info?token="+config.slack.oAuthAccessToken+"&user="+user_id,
            method: 'GET',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }, (error, res, body) => {
            if (error) {
                callback(null, error);
            } else {
                callback(body, null);
            }
        });
    }
}


module.exports = httpGet;
