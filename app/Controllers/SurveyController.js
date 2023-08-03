require('dotenv').config();

class SurveyController {
    async addSurvey(surveyDetails, connection) {
        // console.log('Survey controller surveyDetails:', surveyDetails);
        const Survey = surveyDetails;
        let query = `INSERT IGNORE INTO Survey 
                        VALUES (?, ?, ?, ?)`;
        try {
            const [res] = await connection.query(query, [Survey.ID, Survey.credential_program, Survey.lea, Survey.name]);
            return {
                ...res
            };
        } catch (err) {
            console.log('Survey error:', err);
            throw err;
        }
    } 
}

module.exports = SurveyController;