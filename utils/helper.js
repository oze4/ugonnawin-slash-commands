// HELPER FUNCTIONS
'use strict'

const request = require('request')


module.exports = {
    slack: {
        slash: {
            response: {
                buttonMessage (message, responseType) {
                    let resType = responseType !== 'in_channel' || 'ephemeral' ? 'in_channel' : responseType;
                    let jsonMessage = `
                    {
                        "response_type": "${resType}",
                        "text": "Click button to open URL",
                        "attachments": [
                            {
                                "fallback": "${String(message)}",
                                "actions": [
                                    {
                                        "type": "button",
                                        "url": "${message}"
                                    }
                                ]
                            }
                        ]
                    }
                    `;
                    return JSON.stringify(JSON.parse(jsonMessage));
                },

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
                            res.status(200).send("Something went wrong! " + error);
                        }
                    })
                }
            }
        }
    },
}
