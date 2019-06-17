/**
 * This file is not in '.gitignore' because the repo is private..
 * 
 * We do not copy this folder into the Docker container - you have to supply environmental variables on the contianer.
 * 
 * We supply those environmental varibles in the docker-compose.yml file (on ost-sf-dckr-00).
 * 
 * The "main" import file is in %project_root_dir%/utils/config.js..
 */

const config = {
    app: {
        port: 80,
    },
    slack: {
        versionNumber: "v0",
        appId: 'AKLKGSRS9',
        clientId: '537456956134.666662909893',
        clientSecret: '56db7c3d49acd6db61320fede9b928ff',
        signingSecret: '9329691bcbe98ccc9feba395056972e8',
        verificationToken: 'HSIixqTN97GvyN3APzro6JYw',
        incomingWebHookUrl: 'https://hooks.slack.com/services/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',
    }
}

module.exports = config;
