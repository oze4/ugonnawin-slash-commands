'use strict'
require('dotenv').config();
const app  = require('./app.js');
const port = app.get('port');
//const MongoBot = require('../utils/mongobot');

const server = app.listen(port, /*async*/ () => { 
    const _addr   = server.address();
    const _prefix = _addr.port === 443 ? "https://" : "http://";
    const _host   = _addr.address == "::" ? require('os').hostname : _addr.address;
    console.log(`App started on: '${_prefix}${_host}:${_addr.port}'`) 
   /*
   try {
        await MongoBot.init();
        console.log(`Connected to MongodB`);
        const _addr   = server.address();
        const _prefix = _addr.port === 443 ? "https://" : "http://";
        const _host   = _addr.address == "::" ? require('os').hostname : _addr.address;
        console.log(`App started on: '${_prefix}${_host}:${_addr.port}'`) 
    } catch (err) {
        console.error("Unable to start server!!", err);
    }
    */
});
