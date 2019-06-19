// 

'use strict'
const request = require('request');


const httpPost = {
    jsonMessage: (url, json, contentType = 'application/json') => {
        request({
            uri: url,
            method: 'POST',
            headers: { 'Content-type': contentType },
            json: json
        }, (error, res, body) => {
            if (error){
                res.status(404).send("Something went wrong! " + error);
            }
        })
    }
}


module.exports = httpPost
