const dbConnection = require('../../database/mySQLconnect.js');
// const parseSurveyResponse = require('../../config/parseSurveyResponse.js');
require('dotenv').config();

class CredentialProgramController {
    async addCredentialProgram(credentialProgramDetails, connection) {
        // console.log('CredentialProgram controller credentialProgramDetails:', credentialProgramDetails);

        const CredentialProgram = credentialProgramDetails;

        let query = `INSERT IGNORE INTO Credential_Program 
                     VALUES (?, ?, ?)`;
        try {
            const [res] = await connection.query(query, [CredentialProgram.name, CredentialProgram.lea, CredentialProgram.year]);
            return {
                ...res
            };
        } catch (err) {
            console.log('CredentialProgram controller error:', err)
            throw err;
        }
    }
}

module.exports = CredentialProgramController;