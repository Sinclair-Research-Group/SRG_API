const dbConnection = require('../../database/mySQLconnect');
// const parseSurveyResponse = require('../../config/parseSurveyResponse.js');
require('dotenv').config();

class SurveyRespondentController {
    async addSurveyRespondent(SurveyRespondentDetails) {
        return new Promise((resolve, reject) => {
            console.log('SurveyRespondentController SurveyRespondentDetails:', SurveyRespondentDetails);
            const SurveyRespondent = SurveyRespondentDetails;
            let query = `INSERT IGNORE INTO Survey_Respondent
                         VALUES (?, ?)`;
            dbConnection.query(
                {
                    sql: query,
                    values: [SurveyRespondent.survey, SurveyRespondent.respondent]
                }, (err, res) => {
                    if(err) {
                        console.log('SurveyRespondentController error:', err);
                        reject(err.sqlMessage ?? 'Error');
                    }
                    resolve({
                        ...res
                    });
                });
        });
    }
}

module.exports = SurveyRespondentController;