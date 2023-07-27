const https = require('https');
const fs = require('fs');
const path = require('path');

module.exports = function (api) {
    console.log('In the ssl');

    const options = {
        key: fs.readFileSync('/etc/letsencrypt/live/api.sinclairgroup.org/privkey.pem'), // replace with the path to your private key
        cert: fs.readFileSync('/etc/letsencrypt/live/api.sinclairgroup.org/fullchain.pem') // replace with the path to your certificate
    };

    return https.createServer(options, api);
};

// localhost ssl:
// const http = require('http');
// // const http = require('http');
// const fs = require('fs');
// const path = require('path');

// module.exports = function (api) {
//     console.log('In the ssl');
//     return http.createServer(api);
// };
