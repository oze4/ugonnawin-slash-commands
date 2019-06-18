// HELPER FUNCTIONS

'use strict'
const request = require('request');
const config  = require('./config.js');


const helper = {
    responses: {
        newUrlToButtonMessage (request, text) {
            let isValidUrl = request.body.text.startsWith("http://") || request.body.text.startsWith("https://");
            let url = isValidUrl ? request.body.text : `http://${request.body.text}`;
            let jsonMessage = {
                "response_type": "in_channel",
                "text": ""+ text +"",
                "attachments": [
                    {
                        "fallback": ""+ request.body.text +"",
                        "actions": [
                            {
                                "text": ""+ url +"",
                                "type": "button",
                                "url": ""+ url +""
                            }
                        ]
                    }
                ]
            };
            return jsonMessage;
        },

        getInvalidUrlResponse () {
            const invalidResponses = [
                "Hmmm.. that doesn't seem to be a valid URL..",
                "Gimme a URL!",
                "Please supply a valid URL for me to link!",
                "Need....valid.....URLs....",
                "That URL doesn't pass the smell test...",
                "If it walks like a string, talks like a string, it isn't a valid URL!",
                "C'MON gimme something to work with...that is an invalid URL",
                "You call that a URL?"
            ];
            return invalidResponses[Math.floor(Math.random()*invalidResponses.length)];
        },
    },

    http: {
        sendMessageToSlackResponseURL (responseURL, JSONmessage) {
            let postOptions = {
                uri: responseURL,
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                json: JSONmessage
            }
            request(postOptions, (error, res, body) => {
                if (error){
                    res.status(404).send("Something went wrong! " + error);
                }
            })
        },
        getSlackUserDisplayNameFromId (user_id) {
            let url = "https://slack.com/api/users.info?token="+config.slack.oAuthAccessToken+"&user="+user_id;
            console.log(url);
            let getOptions = {
                uri: url,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
            request(getOptions, (error, res, body) => {
                let jsonBody = JSON.parse(res.body);
                console.log(jsonBody.profile);
                if (error) {
                    console.log(error);
                    res.status(404).send("Something went wrong! " + error);
                }
            })
        }
    },

    validation: {
        isLooselyDefinedUrl (url) {
            // Verify we have a URL (this checks if we have periods and at least two characters at the end after 
            //     a period: eg: someWordWithAt.LeastTwoCharsAtE.nd). That would qualify as a URL.
            const looselyDefinedUrlRegex = RegExp(/[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/g);
            return looselyDefinedUrlRegex.test(url);
        }
    }
}


module.exports = helper;
