const config = require('./config.js');
const crypto = require('crypto');
const qs     = require('querystring');



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
                return res.status(200).send('no slack signature');
            } else {
                let timeStamp = req.headers['x-slack-request-timestamp'];
                if (_lessThanFiveMinutes(timeStamp)) {
                    if (_validateSlackRequest(config.slack.signingSecret, req, res, true)) {
                        next()
                    } else {
                        res.status(200).send("Slack signature does not match hash!");
                    }
                    /*let bodyString = qs.stringify(req.body, { format: 'RFC1738' });  // If RFC1738 is not used it will fail
                    let bs = JSON.stringify(req.body);
                    let reqSignature = `${config.slack.versionNumber}:${timeStamp}:${bodyString}`;
                    let hashed = crypto.createHmac('sha256', config.slack.signingSecret).update(reqSignature, 'utf8').digest('hex');
                    console.log("signingSecret: " + config.slack.signingSecret);
                    console.log("qs.stringify: " + bodyString);
                    console.log("JSON.stringify: " + req.body());
                    console.log("hashedSignature: " + hashed);
                    let sig = `${config.slack.versionNumber}=${hashed}`;
                    if (crypto.timingSafeEqual(Buffer.from(sig, 'utf8'), Buffer.from(slackSignature, 'utf8'))) {
                        next();
                    } else {
                        return res.status(200).send('Verification failed');
                    }*/
                } else {
                    // If the request is older than 5 minutes, it is possible it may be a replay attack
                    // so we drop it.
                    return res.status(200).send('older than five min');
                }
            }
        }
    }
}


function _lessThanFiveMinutes(reqTimestamp) {
    let now = new Date(),
        then = new Date(Number(reqTimestamp)),
        FIVE_MIN = 5 * 60 * 1000;
    console.log(typeof(then))
    return (then - now) < FIVE_MIN ? true : false;
}

function _validateSlackRequest (slackAppSigningSecret, httpReq, httpRes, logging) {
    // from:
    // https://github.com/gverni/validate-slack-request/blob/master/index.js
    logging = logging || false
    if (typeof logging !== 'boolean') {
      throw new Error('Invalid type for logging. Provided ' + typeof logging + ', expected boolean')
    }
    if (!slackAppSigningSecret || typeof slackAppSigningSecret !== 'string' || slackAppSigningSecret === '') {
      return httpRes.status(200).send('Invalid slack app signing secret')
    }
    const xSlackRequestTimeStamp = httpReq.get('X-Slack-Request-Timestamp')
    const SlackSignature = httpReq.get('X-Slack-Signature')
    const bodyPayload = qs.stringify(httpReq.body).replace(/%20/g, '+') // Fix for #1
    if (!(xSlackRequestTimeStamp && SlackSignature && bodyPayload)) {
      if (logging) { console.log('Missing part in Slack\'s request') }
      //return false
      return httpRes.status(200).send('Invalid Slack Request');
    }
    const baseString = 'v0:' + xSlackRequestTimeStamp + ':' + bodyPayload
    const hash = 'v0=' + crypto.createHmac('sha256', slackAppSigningSecret).update(baseString).digest('hex')

    if (logging) {
      console.log('Slack verifcation:\n Request body: ' + bodyPayload + '\n Calculated Hash: ' + hash + '\n Slack-Signature: ' + SlackSignature)
    }

    return (SlackSignature === hash)
  }


module.exports = middleware;
