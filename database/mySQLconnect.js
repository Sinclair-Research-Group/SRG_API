var mysql = require('mysql');

var connection = mysql.createConnection({
        debug: false,
        host: 'srg-database-mysql-do-user-14371739-0.b.db.ondigitalocean.com',
        port: 25060,
        user: 'areyna',
        password: 'AVNS_ACW8YxBDBzPrTOdT03T',
        database: 'srg'
});

module.exports = connection;