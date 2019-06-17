// HELPER FUNCTIONS
'use strict'

const request = require('request')


module.exports = {
    responses: {
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
                    res.status(400).send("Something went wrong! " + error);
                }
            })
        },
    },
}
