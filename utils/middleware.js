const config = require('./config.js');
const crypto = require('crypto');
const qs     = require('querystring');



function lessThanFiveMinutes(reqTimestamp) {
    let now = new Date(),
        then = new Date(reqTimestamp),
        FIVE_MIN = 5 * 60 * 1000;
    return (then - now) < FIVE_MIN ? true : false;
}


const middleware = {
    route: {
        status: {
            fourzerofour(req, res, next) {
                res.status(404).send("Hmmm.. can't find that..")
            },
        }
    },

    request: {
        verifySlackRequest(req, res, next) {
            let slackSignature = req.headers['x-slack-signature'];
            if (!slackSignature) {
                return res.status(400).send();
            } else {
                let timeStamp = req.headers['x-slack-request-timestamp'];
                if (lessThanFiveMinutes(timeStamp)) {
                    let bodyString = qs.stringify(req.body, { format: 'RFC1738' });  // If RFC1738 is not used it will fail
                    let reqSignature = `${config.slack.versionNumber}:${timeStamp}:${bodyString}`;
                    let sig = `${config.slack.versionNumber}=${crypto.createHmac('sha256', config.slack.signingSecret).update(reqSignature, 'utf8').digest('hex')}`
                    if (crypto.timingSafeEqual(Buffer.from(sig, 'utf8'), Buffer.from(slackSignature, 'utf8'))) {
                        next();
                    } else {
                        return res.status(400).send('Verification failed');
                    }
                } else {
                    // If the request is older than 5 minutes, it is possible it may be a replay attack
                    // so we drop it.
                    return res.status(400).send();
                }
            }
        }
    }
}

module.exports = middleware;
