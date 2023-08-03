require('dotenv').config();

class QuestionController {
    async addQuestion(questionDetails, connection) {
        try {
            const Question = questionDetails;
            let query = `INSERT IGNORE INTO Question (description, survey, respondent, response, weight)
                            VALUES (?, ?, ?, ?, ?)`;
            await connection.query(query, [Question.description, Question.survey, Question.respondent, Question.response, Question.weight]);
            const [results] = await connection.query('SELECT LAST_INSERT_ID() as ID');
            const questionID = results[0]?.ID;
            console.log('Question controller questionID: ', questionID);
            return {
                results,
                questionID
            };
        } catch (err) {
            console.log('Question controller erorr: ', err);
            throw err.sqlMessage ?? 'Error';
        }
    }
}

module.exports = QuestionController;