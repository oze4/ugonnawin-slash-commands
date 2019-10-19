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
        weatherApi: {
            apiKey: process.env.OPENWEATHERMAP_API_KEY,
            baseUrl: process.env.OPENWEATHERMAP_BASE_URL
        },  
        slack: {
            //versionNumber: "v0",
            appId: process.env.APP_ID,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            signingSecret: process.env.SIGNING_SECRET,
            verificationToken: process.env.VERIFICATION_TOKEN,
            oAuthAccessToken: process.env.OAUTH_ACCESS_TOKEN,
            botOAuthAccessToken: process.env.BOT_OAUTH_ACCESS_TOKEN,
            incomingWebHookUrl: process.env.INCOMING_WEB_HOOK_URL,
        },
    }

    if (config.weatherApi.baseUrl.endsWith("/")) {
        config.weatherApi.baseUrl = config.weatherApi.baseUrl.slice(0, -1);
    }
    if (config.weatherApi.baseUrl.endsWith("\\")) {
        config.weatherApi.baseUrl = config.weatherApi.baseUrl.slice(0, -1);
    }
}


module.exports = config;
