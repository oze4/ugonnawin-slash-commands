// HELPER FUNCTIONS

'use strict'
const validation  = require('./validation');
const slack       = require('./slack');
const http        = require('./http');


const helper = {
    validation,
    slack,
    http,
}


module.exports = helper;
