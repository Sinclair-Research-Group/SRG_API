var mysql = require('mysql');

var connection = mysql.createConnection({
        debug: false,
        host: 'localhost',
        port: 3306,
        user: 'areyna',
        password: '4Alanarox!',
        database: 'srg'
});

module.exports = connection;