const dbConnection = require('../../database/mySQLconnect');
// const parseSurveyResponse = require('../../config/parseSurveyResponse.js');
require('dotenv').config();

class QuestionRespondentController {
    async addQuestionRespondent(QuestionRespondentDetails, connection) {
        // console.log('Question controller questionDetails:', questionDetails);
        const QuestionRespondent = QuestionRespondentDetails;
        let query = `INSERT IGNORE INTO Question_Respondent 
                        VALUES (?, ?, ?)`;
        try {
            const [res] = await connection.query(query, [QuestionRespondent.question, QuestionRespondent.survey, QuestionRespondent.respondent]);
            return {
                ...res
            };
        } catch (err) {
            console.log('QuestionRespondent error:', err);
            throw err;
        }
    }
}

module.exports = QuestionRespondentController;