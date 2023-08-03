require('dotenv').config();

class LEASurveyController {
    async addLEASurvey(LEASurveyDetails, connection) {
        // console.log('LEASurveyController LEASurveyDetails:', LEASurveyDetails);
        const LEASurvey = LEASurveyDetails;
        let query = `INSERT IGNORE INTO LEA_Survey 
                     VALUES (?, ?)`;
        try {
            const [res] = await connection.query(query, [LEASurvey.lea, LEASurvey.survey]);
            return {
                ...res
            };
        } catch (err) {
            console.log('LEASurvey error:', err);
            throw err;
        } 
    }
}

module.exports = LEASurveyController;