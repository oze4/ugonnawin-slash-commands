// 

'use strict'
const request = require('request');


const httpPost = {
    sendMessageToSlackResponseURL: (responseURL, JSONmessage) => {
        request({
            uri: responseURL,
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            json: JSONmessage
        }, (error, res, body) => {
            if (error){
                res.status(404).send("Something went wrong! " + error);
            }
        })
    }
}


module.exports = httpPost
