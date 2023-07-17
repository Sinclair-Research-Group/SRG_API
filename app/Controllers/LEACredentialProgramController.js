const dbConnection = require('../../database/mySQLconnect.js');
// const parseSurveyResponse = require('../../config/parseSurveyResponse.js');
require('dotenv').config();

class LEACredentialProgramController {
    async addLEACredentialProgram(LEACredentialProgramDetails) {
        return new Promise((resolve, reject) => {
            console.log('LEACredentialProgram controller LEACredentialProgramDetails:', LEACredentialProgramDetails);
            const LEACredentialProgram = LEACredentialProgramDetails;
            let query = `INSERT INTO LEA_Credential_Program (lea, credential_program)
                         VALUES (?, ?)`;
            dbConnection.query(
                {
                    sql: query,
                    values: [LEACredentialProgram.lea, LEACredentialProgram.credentialProgram]
                }, (err, res) => {
                    if(err) {
                        console.log('LEACredentialProgramController error:', err);
                        reject(err.sqlMessage ?? 'Error');
                    }
                    console.log('Query result:', res);
                    resolve({
                        ...res
                    });
                });
        });
    }
}

module.exports = LEACredentialProgramController;