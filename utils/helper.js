// HELPER FUNCTIONS

'use strict'
const request = require('request')


const helper = {
    responses: {
        newUrlToButtonMessage (request) {
            let isValidUrl = request.body.text.startsWith("http://") || request.body.text.startsWith("https://");
            let url = isValidUrl ? request.body.text : `http://${request.body.text}`;
            let jsonMessage = {
                "response_type": "in_channel",
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

    transporter: {
        sendMessageToSlackResponseURL (responseURL, JSONmessage) {
            var postOptions = {
                uri: responseURL,
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                json: JSONmessage
            }
            request(postOptions, (error, res, body) => {
                if (error){
                    // handle errors as you see fit
                    res.status(404).send("Something went wrong! " + error);
                }
            })
        },
    },

    validation: {
        isLooselyDefinedUrl (url) {
            // Verify we have a URL (this checks if we have periods and at least two characters at the end after 
            //     a period: eg: someWordWithAt.LeastTwoCharsAtE.nd). That would qualify as a URL. We verify the
            //     string has either 'http' or 'https' below, if it doesn't we add 'http' (and let the website
            //     handle redirection to 'https', if it does). Basically we play it safe.
            const looselyDefinedUrlRegex = RegExp(/[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/g);
            return looselyDefinedUrlRegex.test(url);
        }
    }
}


module.exports = helper;
