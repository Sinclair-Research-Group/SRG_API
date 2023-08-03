const mysql = require('mysql2/promise');

console.log('MAMA I MADE IT...INTO THE DB FILE');
const pool = mysql.createPool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE
});

// pool.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
//         if (error) throw error;
//         console.log('The solution is: ', results[0].solution);
// });

module.exports = pool;