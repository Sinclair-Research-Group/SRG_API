const dbConnection = require('../../database/mySQLconnect.js');
// const parseSurveyResponse = require('../../config/parseSurveyResponse.js');
require('dotenv').config();

class SurveyController {
    async addSurvey(surveyDetails) {
        return new Promise((resolve, reject) => {
            console.log('Survey controller surveyDetails:', surveyDetails);
            const Survey = surveyDetails;
            let query = `INSERT IGNORE INTO Survey 
                         VALUES (?, ?, ?, ?)`;
            dbConnection.query(
                {
                    sql: query,
                    values: [Survey.ID, Survey.credential_program, Survey.lea, Survey.name]
                }, (err, res) => {
                    if(err) {
                        console.log('Survey controller error:', err);
                        reject(err.sqlMessage ?? 'Error');
                    }
                    resolve({
                        ...res
                    });
                });
        });
    }
}

module.exports = SurveyController;