//
// MIDDLEWARE for routes
//
// Currently (6/16/2019) this module contains methods that some may or may 
//     consider to be true 'middleware' - these methods are commented and
//     should most likely be moved to a 'utility.js' or 'helper.js' module.
//
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
                next();
            } else {
                res.status(400).send("Slack signature does not match hash!");
            }
        },

        //TODO: move this into a 'utility.js' or 'helper.js' file - doesn't belong in middleware
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

    //TODO: possibly move this into a 'utility.js' or 'helper.js' file - 
    //      not sure how I feel about it living in middleware
    logger: {
        headers (req, res, next) {
            console.log("*********************** req.headers ******************************");
            console.log(req.headers);
            console.log("********************* end req.headers ****************************\r\n\r\n");
            next();
        }
    }
}


function _lessThanFiveMinutes(reqTimestamp) {
    let FIVE_MIN = 5 * 60 * 1000;
    return ((new Date(Number(reqTimestamp))) - (new Date())) < FIVE_MIN;
}

function _validateSlackRequest (slackAppSigningSecret, slackVersionNumber, httpReq, httpRes) { 
    //  !!~ REQUIRES 'querystring' PACKAGE ~!!
    //  Taken From: https://github.com/gverni/validate-slack-request/blob/master/index.js

    if (!slackAppSigningSecret || typeof slackAppSigningSecret !== 'string' || slackAppSigningSecret === '') {
        return httpRes.status(400).send('Slack signing secret empty or not a string');
    }

    const SlackSignature = httpReq.get('X-Slack-Signature')
    if (!SlackSignature) {
        return res.status(400).send('No Slack signature found in request');
    }

    const xSlackRequestTimeStamp = httpReq.get('X-Slack-Request-Timestamp')
    if (!_lessThanFiveMinutes(xSlackRequestTimeStamp)) {
        // If the request is older than 5 minutes it is possible 
        //     that the request may be a replay attack so we drop it.
        return res.status(400).send('older than five min');
    }

    const bodyPayload = qs.stringify(httpReq.body).replace(/%20/g, '+');
    if (!(xSlackRequestTimeStamp && SlackSignature && bodyPayload)) {
      return httpRes.status(400).send('Invalid request from Slack');
    }

    const baseString = `${slackVersionNumber}:${xSlackRequestTimeStamp}:${bodyPayload}`;
    const hash = `${slackVersionNumber}=${crypto.createHmac('sha256', slackAppSigningSecret).update(baseString).digest('hex')}`;

    return (SlackSignature === hash);
  }


module.exports = middleware;
