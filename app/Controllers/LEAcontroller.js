const dbConnection = require('../../database/mySQLconnect.js');
require('dotenv').config();

class LEAController {
    async addLEA(leaDetails) {
        return new Promise((resolve, reject) => {
            console.log('LEA controller leaDetails:', leaDetails);
            const LEA = leaDetails;

            let query = `INSERT IGNORE INTO LEA (name, lead_LEA)
                         VALUES (?, ?)`;
            dbConnection.query(
                {
                    sql: query,
                    values: [LEA.name, LEA.lead_LEA]
                }, (err, res) => {
                    if(err) {
                        console.log('LEA controller error with first insert:', err);
                        reject(err.sqlMessage ?? 'Error');
                    }
                    else {
                        dbConnection.query('SELECT LAST_INSERT_ID() as ID', (err, results) => {
                            if(err) {
                                console.log('LEA controller error with second insert id:', err);
                                reject(err.sqlMessage ?? 'Error');
                            }
                            const leaID = results[0]?.ID;
                            console.log('LEA controller leaID:', leaID);
                            resolve({
                                ...res,
                                leaID
                            });
                        });
                    }
                });
        });
    }
}

module.exports = LEAController;