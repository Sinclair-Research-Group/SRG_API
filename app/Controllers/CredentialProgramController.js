const dbConnection = require('../../database/mySQLconnect.js');
// const parseSurveyResponse = require('../../config/parseSurveyResponse.js');
require('dotenv').config();

class CredentialProgramController {
    async addCredentialProgram(credentialProgramDetails) {
        return new Promise((resolve, reject) => {
            console.log('CredentialProgram controller credentialProgramDetails:', credentialProgramDetails);

            const CredentialProgram = credentialProgramDetails;

            let query = `INSERT IGNORE INTO Credential_Program 
                         VALUES (?, ?, ?)`;
            dbConnection.query(
                {
                    sql: query,
                    values: [CredentialProgram.name, CredentialProgram.lea, CredentialProgram.year]
                }, (err, res) => {
                    if(err) {
                        console.log('CredentialProgram controller error:', err)
                        reject(err.sqlMessage ?? 'Error');
                    }
                    resolve({
                        ...res
                    });
                });
        });
    }
}

module.exports = CredentialProgramController;