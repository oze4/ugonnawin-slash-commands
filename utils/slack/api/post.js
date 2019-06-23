// 

'use strict'
const request = require('request');


const httpPost = {
    /**
     * @param  {String} url
     * @param  {Object} json
     * @param  {String} contentType='application/json'
     */
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
