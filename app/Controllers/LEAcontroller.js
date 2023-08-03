const dbConnection = require('../../database/mySQLconnect.js');
require('dotenv').config();

class LEAController {
    async addLEA(leaDetails, connection) {
        try {
            const LEA = leaDetails;
            let query = `INSERT IGNORE INTO LEA (name, lead_LEA)
                         VALUES (?, ?)`;
            await connection.query(query, [LEA.name, LEA.lead_LEA]);
            const [results] = await connection.query('SELECT LAST_INSERT_ID() as ID');
            const leaID = results[0]?.ID;
            console.log('LEA controller leaID: ', leaID);
            return {
                results,
                leaID
            };
        } catch (err) {
            console.log('LEA controller error: ', err);
            throw err.sqlMessage ?? 'Error';
        }
    }
}

module.exports = LEAController;