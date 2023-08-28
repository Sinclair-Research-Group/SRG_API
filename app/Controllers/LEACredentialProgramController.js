const dbConnection = require('../../database/mySQLconnect.js');
// const parseSurveyResponse = require('../../config/parseSurveyResponse.js');
require('dotenv').config();

class LEACredentialProgramController {
    async addLEACredentialProgram(LEACredentialProgramDetails, connection) {
        // console.log('LEACredentialProgram controller LEACredentialProgramDetails:', LEACredentialProgramDetails);
        const LEACredentialProgram = LEACredentialProgramDetails;
        let query = `INSERT IGNORE INTO LEA_Credential_Program (lea, credential_program)
                     VALUES (?, ?)`;
        try {
            const [res] = await connection.query(query, [LEACredentialProgram.lea, LEACredentialProgram.credentialProgram]);
            return {
                ...res
            };
        } catch (err) {
            console.log('LEACredentialProgramController error:', err);
            throw err;
        }
    }
}

module.exports = LEACredentialProgramController;