require('dotenv').config();

class SurveyRespondentController {
    async addSurveyRespondent(SurveyRespondentDetails, connection) {
        // console.log('SurveyRespondentController SurveyRespondentDetails:', SurveyRespondentDetails);
        const SurveyRespondent = SurveyRespondentDetails;
        let query = `INSERT IGNORE INTO Survey_Respondent
                     VALUES (?, ?, ?)`;
        try {
            const [res] = await connection.query(query, [SurveyRespondent.survey, SurveyRespondent.session, SurveyRespondent.respondent]);
            return {
                ...res
            };
        } catch (err) {
            console.log('Survey error:', err);
            throw err;
        }
    }
}

module.exports = SurveyRespondentController;