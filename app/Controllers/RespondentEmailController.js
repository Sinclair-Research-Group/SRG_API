const dbConnection = require('../../database/mySQLconnect');
// const parseSurveyResponse = require('../../config/parseSurveyResponse.js');
require('dotenv').config();

class RespondentEmailController {
    async addRespondentEmail(RespondentEmailDetails) {
        return new Promise((resolve, reject) => {
            console.log('RespondentEmailController RespondentEmailDetails:', RespondentEmailDetails);
            const Email = RespondentEmailDetails;
            let query = `INSERT IGNORE INTO Respondent_Email 
                         VALUES (?, ?)`;
            dbConnection.query(
                {
                    sql: query,
                    values: [Email.email, Email.respondent]
                }, (err, res) => {
                    if(err) {
                        console.log('RespondentEmailController error:', err);
                        reject(err.sqlMessage ?? 'Error');
                    }
                    resolve({
                        ...res
                    });
                });
        });
    }
}

module.exports = RespondentEmailController;