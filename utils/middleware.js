// Middleware for routes.. Currently (6/16/2019) this module contains methods 
//     that some may or may consider to be true 'middleware' - these methods 
//     are commented and should most likely be moved to a 'utility.js' or 
//     'helper.js' module.

'use strict'
const config = require('./config.js');
const crypto = require('crypto');
const qs     = require('querystring');


const middleware = {
    route: {
        status: {
            fourzerofour (req, res, next) {
                res.status(404).send("Hmmm.. can't find that..");
            },
        }
    },

    request: {
        verifySlackRequest (req, res, next) {
            if (_validateSlackRequest(config.slack.signingSecret, config.slack.versionNumber, req, res)) {
                let tokenInRequest;               
                try { 
                    tokenInRequest = JSON.parse(req.body.payload).token 
                } catch { 
                    tokenInRequest = req.body.token 
                };
                if (tokenInRequest === config.slack.verificationToken) {
                    next();
                } else {
                    console.log("Slack verification token mismatch!");
                    //res.status(200).send("Slack verification token mismatch!");
                }
            } else {
                console.log("Slack signature does not match hash!");
                //res.status(200).send("Slack signature does not match hash!");
            }
        },

        allowCors (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        },
    },

    logger: {
        headersAndbody (req, res, next) {
            console.log("~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*");
            console.log("~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*");
            console.log("------------------------ req.url ---------------------------------");
            console.log(req.url)
            console.log("---------------------- end req.url -------------------------------");
            console.log("----------------------- req.headers ------------------------------");
            console.log(req.headers);
            console.log("--------------------- end req.headers ----------------------------");
            console.log("------------------------- req.body -------------------------------");
            console.log(req.body);
            console.log("------------------------ end req.body ----------------------------");
            console.log("~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*");
            console.log("~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*\r\n\r\n");
            next();
        },
    }
}


// Determines if X timestamp is less than five minutes old. This is done to
//     verify the Slack request isn't older than five minutes. If it is, it
//     is possible it might be a replay attack, so we drop it.
function _lessThanFiveMinutes(reqTimestamp) {
    let FIVE_MIN = 5 * 60 * 1000;
    return ((new Date(Number(reqTimestamp))) - (new Date())) < FIVE_MIN;
}


//  !!~ REQUIRES 'querystring' PACKAGE ~!!
//      Taken From: https://github.com/gverni/validate-slack-request/blob/master/index.js
function _validateSlackRequest (slackAppSigningSecret, slackVersionNumber, httpReq, httpRes) { 
    let signingSecretIsInvalid = !slackAppSigningSecret || typeof slackAppSigningSecret !== 'string' || slackAppSigningSecret === '';
    if (signingSecretIsInvalid) { return httpRes.status(200).send('Slack signing secret empty or not a string'); }
    const SlackSignature = httpReq.get('X-Slack-Signature')
    if (!SlackSignature) { return res.status(200).send('No Slack signature found in request'); }
    const xSlackRequestTimeStamp = httpReq.get('X-Slack-Request-Timestamp')
    if (!_lessThanFiveMinutes(xSlackRequestTimeStamp)) { return res.status(200).send('older than five min'); }
    let stagingBody = httpReq.body.payload || httpReq.body;
    const bodyPayload = qs.stringify(stagingBody).replace(/%20/g, '+');
    if (!(xSlackRequestTimeStamp && SlackSignature && bodyPayload)) { return httpRes.status(200).send('Invalid request from Slack'); }
    const baseString = `${slackVersionNumber}:${xSlackRequestTimeStamp}:${bodyPayload}`;
    const hash = `${slackVersionNumber}=${crypto.createHmac('sha256', slackAppSigningSecret).update(baseString).digest('hex')}`;
    return (SlackSignature === hash);
}


module.exports = middleware;
