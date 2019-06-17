// Main Express server - this is where the actual listener lives.

'use strict'
const app  = require('./app.js');
const port = app.get('port');

const server = app.listen(port, () => { 
    const _addr   = server.address();
    const _prefix = _addr.port === 443 ? "https://" : "http://";
    const _host   = _addr.address == "::" ? require('os').hostname : _addr.address;
    console.log(`App started on: '${_prefix}${_host}:${_addr.port}'`) 
});
