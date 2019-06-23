// Config file to be used for local testing - otherwise these vars need to be supplied via Docker

'use strict'
const config = {
    app: {
        port: 80,
    },
    weatherApi: {
        apiKey: "9d6e842241161dffa8f9963157efeded",
        baseUrl: "https://api.openweathermap.org/data/2.5"
    }, 
    slack: {
        versionNumber: "v0",
        appId: 'AKLKGSRS9',
        clientId: '537456956134.666662909893',
        clientSecret: '56db7c3d49acd6db61320fede9b928ff',
        signingSecret: '9329691bcbe98ccc9feba395056972e8',
        verificationToken: 'HSIixqTN97GvyN3APzro6JYw',
        oAuthAccessToken: 'xoxp-537456956134-536227564035-666665028144-eb1d2b7eefb7c391bc8e545d3c65764d',
        incomingWebHookUrl: 'https://hooks.slack.com/services/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',
    }
}

if (config.weatherApi.baseUrl.endsWith("/")) {
    config.weatherApi.baseUrl = config.weatherApi.baseUrl.slice(0, -1);
}
if (config.weatherApi.baseUrl.endsWith("\\")) {
    config.weatherApi.baseUrl = config.weatherApi.baseUrl.slice(0, -1);
}


module.exports = config;
