// Slack module entry point

'use strict'
const messageBuilder = require('./messageBuilder');
const api            = require('./api');


const slack = {
    messageBuilder,
    api
}


module.exports = slack;
