const app  = require('./app.js');
const port = app.get('port');

const server = app.listen(port, () => { 
    const _addr   = server.address();
    const _prefix = _addr.port === 443 ? "https://" : "http://";
    const _host   = _addr.address == "::" ? 'localhost' : _addr.address;
    console.log(`App started on: '${_prefix}${_host}:${_addr.port}'`) 
});