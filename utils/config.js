// Main config file - this reads the "filled" config file if it can.
//     If the "filled" config is not reachable (aka in a Docker container)
//     then we read the environmental variables (aka supplied in the Docker
//     commands used to start the container).

'use strict'
let config;

try {
    config = require('../config/config.js')
} catch {
    config = {
        app: {
            port: process.env.PORT,
        },
        slack: {
            versionNumber: "v0",
            appId: process.env.APP_ID,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            signingSecret: process.env.SIGNING_SECRET,
            verificationToken: process.env.VERIFICATION_TOKEN,
            incomingWebHookUrl: process.env.INCOMING_WEB_HOOK_URL,
        },
    }
}


module.exports = config;
