const https = require('https');
// const http = require('http');
const fs = require('fs');
const path = require('path');

module.exports = function (api) {
    console.log('In the ssl');
    return https.createServer(api);
};

