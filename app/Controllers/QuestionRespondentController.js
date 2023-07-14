const dbConnection = require('../../database/mySQLconnect');
// const parseSurveyResponse = require('../../config/parseSurveyResponse.js');
require('dotenv').config();

class QuestionRespondentController {
    async addQuestionRespondent(QuestionRespondentDetails) {
        return new Promise((resolve, reject) => {
            const QuestionRespondent = QuestionRespondentDetails;
            let query = `INSERT IGNORE INTO Question_Respondent 
                         VALUES (?, ?, ?)`;
            dbConnection.query(
                {
                    sql: query,
                    values: [QuestionRespondent.question, QuestionRespondent.survey, QuestionRespondent.respondent]
                }, (err, res) => {
                    if(err) {
                        console.log('QuestionRespondentController error:', err);
                        reject(err.sqlMessage ?? 'Error');
                    }
                    resolve({
                        ...res
                    });
                });
        });
    }
}

module.exports = QuestionRespondentController;