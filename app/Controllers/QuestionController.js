require('dotenv').config();

class QuestionController {
    async addQuestion(questionDetails, connection) {
        try {
            // console.log('questionDetails in question controller: ', questionDetails);
            const Question = questionDetails;
            let query = `INSERT IGNORE INTO Question (description, survey, session, respondent, response, weight)
                            VALUES (?, ?, ?, ?, ?, ?)`;
            await connection.beginTransaction();
            const results = await connection.query(query, [Question.description, Question.survey, Question.session, Question.respondent, Question.response, Question.weight]);
            if (results[0].warningStatus > 0) {
                const [warnings] = await connection.query('SHOW WARNINGS');
                console.log('MySQL Warnings:', warnings);
            }
            // const [results] = await connection.query('SELECT LAST_INSERT_ID() as ID');
            // console.log('results from question controller: ', results);
            await connection.commit();
            // const questionID = results[0]?.ID;
            const questionID = results[0].insertId; 
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