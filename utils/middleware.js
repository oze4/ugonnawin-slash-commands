'use strict'
const crypto = require('crypto');
const qs = require('querystring');

const middleware = {
    route: {
        status: {
            fourzerofour(req, res, next) {
                res.status(404).send("Hmmm.. can't find that..");
            },
        }
    },

    request: {
        verifySlackRequest(req, res, next) {
            if (validateRequestIsFromSlack(process.env.SIGNING_SECRET, "v0", req, res)) {
                if (verifySlackToken(req)) {
                    next();
                } else {
                    console.log("Slack verification token mismatch!");
                    res.status(200).send("Slack verification token mismatch!");
                }
            } else {
                console.log("Slack signature does not match hash!");
                res.status(200).send("Slack signature does not match hash!");
            }
        },

        allowCors(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        },
    },

    logger: {
        headersAndbody(req, res, next) {
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

/**
 * 
 * @param {Number} reqTimestamp
 * 
 * @description  Determines if X timestamp is less than five minutes old. This is done to verify the Slack request isn't older than 
 *                 five minutes. If it is, it is possible it might be a replay attack, so we drop it. 
 */
function lessThanFiveMinutesOld(reqTimestamp) {
    let FIVE_MIN = 5 * 60 * 1000;
    return ((new Date(Number(reqTimestamp))) - (new Date())) < FIVE_MIN;
}

/**
 * 
 * @param {String} slackAppSigningSecret 
 * @param {String} slackVersionNumber 
 * @param {HttpRequest} httpReq 
 * @param {HttpResponse} httpRes 
 * 
 * @description Validates the request has not been modified en route. This is done per Slack. Slack recommends doing this per best practices. 
 *              - Taken From: https://github.com/gverni/validate-slack-request/blob/master/index.js
 */
function validateRequestIsFromSlack(slackAppSigningSecret, slackVersionNumber, httpReq, httpRes) {
    let signingSecretIsInvalid = !slackAppSigningSecret || typeof slackAppSigningSecret !== 'string' || slackAppSigningSecret === '';

    if (signingSecretIsInvalid) {
        console.log('Slack signing secret empty or not a string');
        return httpRes.status(200).send('Slack signing secret empty or not a string');
    }

    const SlackSignature = httpReq.get('X-Slack-Signature')

    if (!SlackSignature) {
        console.log('No Slack signature found in request');
        return res.status(200).send('No Slack signature found in request');
    }

    const xSlackRequestTimeStamp = httpReq.get('X-Slack-Request-Timestamp')

    if (!lessThanFiveMinutesOld(xSlackRequestTimeStamp)) {
        console.log('older than five min');
        return res.status(200).send('older than five min');
    }


    let stagingBody = httpReq.rawBody || httpReq.body.payload || httpReq.body;
    console.log("httpReq.rawBody", httpReq.rawBody);
    console.log("~stagingBody~", JSON.stringify(stagingBody));
    const bodyPayload = qs.stringify(stagingBody).replace(/%20/g, '+');
    console.log("~bodyPayload~", JSON.stringify(bodyPayload));

    if (!(xSlackRequestTimeStamp && SlackSignature && stagingBody)) {
        console.log('Invalid request from Slack');
        console.log("xSlackRequestTimeStamp, SlackSignature, bodyPayload", xSlackRequestTimeStamp, SlackSignature, bodyPayload)
        return httpRes.status(200).send('Invalid request from Slack');
    }

    const baseString = `${slackVersionNumber}:${xSlackRequestTimeStamp}:${bodyPayload}`;
    const hash = `${slackVersionNumber}=${crypto.createHmac('sha256', slackAppSigningSecret).update(baseString).digest('hex')}`;

    return (SlackSignature === hash);
}

/**
 * 
 * @param {HttpRequest} req
 * 
 * @description Verifies that the Slack Verification Token (which they send on each request to us), matches what we have. 
 */
function verifySlackToken(req) {
    let tokenInRequest = req.body.token || JSON.parse(req.body.payload).token;
    console.log("~TOKEN IN REQUEST~", tokenInRequest);
    return tokenInRequest === process.env.VERIFICATION_TOKEN;
}


module.exports = middleware;