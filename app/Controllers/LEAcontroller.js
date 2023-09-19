const dbConnection = require('../../database/mySQLconnect.js');
require('dotenv').config();

class LEAController {
    async addLEA(leaDetails, connection) {
        try {
            const LEA = leaDetails;
            let query = `INSERT IGNORE INTO LEA (name, lead_LEA)
                         VALUES (?, ?)`;
            let [rows] = await connection.query('SELECT ID FROM LEA WHERE TRIM(name) = ? AND TRIM(lead_LEA) = ?', [LEA.name, LEA.lead_LEA]);
            let leaID;
            if(rows.length === 0) {
                // If no existing LEA is found, then insert the new LEA and get the ID.
                let results = await connection.query(query, [LEA.name, LEA.lead_LEA]);
                leaID = results[0].insertId; 
                console.log('leaID in if ID doesnt exist yet:', leaID);
            } else {
                // If existing LEA is found, use the existing ID.
                leaID = rows[0].ID;
                console.log('Existing leaID found: ', leaID);
            }
            console.log('LEA controller leaID: ', leaID);
            return {
                results: rows,
                leaID
            };
        } catch (err) {
            console.log('LEA controller error: ', err);
            throw err.sqlMessage ?? 'Error';
        }
    }
}

module.exports = LEAController;