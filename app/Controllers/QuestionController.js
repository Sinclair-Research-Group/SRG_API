const dbConnection = require('../../database/mySQLconnect.js');
//const parseSurveyResponse = require('../../config/parseSurveyResponse.js');
require('dotenv').config();

class QuestionController {
    async addQuestion(questionDetails) {
        return new Promise((resolve, reject) => {
            console.log('Question controller questionDetails:', questionDetails)
            const Question = questionDetails;
            let query = `INSERT IGNORE INTO Question 
                         VALUES (?, ?, ?, ?, ?, ?)`;
            dbConnection.query(
                {
                    sql: query,
                    values: [Question.ID, Question.description, Question.survey, Question.respondent, Question.response, Question.weight]
                }, (err, res) => {
                    if(err) {
                        console.log('Question controller error:', err);
                        reject(err.sqlMessage ?? 'Error');
                    }
                    resolve({
                        ...res,
                    });
                });
        });
    }
}

module.exports = QuestionController;