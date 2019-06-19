//

'use strict'
const request      = require('request');
const config       = require('../../config.js');
const baseSlackUrl = "https://slack.com/api/";

class SlackGet {
    static userInfo(user_id, callback) {
        request({
            uri: baseSlackUrl + "users.info?token=" + config.slack.oAuthAccessToken + "&user=" + user_id,
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

    static userName (user_id, callback) {
        this.userInfo(user_id, (data, err) => {
            if (err) {
                callback(null, err);
            } else {
                if (data) {
                    let user = JSON.parse(data).user;
                    let userName = user.profile.display_name !== '' 
                                    ? user.profile.display_name : user.name !== ''
                                        ? user.name : user.real_name !== ''
                                            ? user.real_name : "-unable to locate user-";
                    callback(userName, null);
                }
            }
            
        });
    }
}


module.exports = SlackGet;
