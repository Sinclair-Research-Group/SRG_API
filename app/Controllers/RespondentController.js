require('dotenv').config();

class RespondentController {
    async addRespondent(respondentDetails, connection) {
        try {
            const Respondent = respondentDetails;
            let query = `INSERT IGNORE INTO Respondent (lea, credential_program, first_name, last_name, teacher_group, program_role, years)
                         VALUES (?, ?, ?, ?, ?, ?, ?)`;
            await connection.query(query, [Respondent.lea, Respondent.credential_program, Respondent.first_name, Respondent.last_name, Respondent.teacher_group, Respondent.program_role, Respondent.years]);
            const [results] = await connection.query('SELECT LAST_INSERT_ID() as ID');
            const respondentID = results[0]?.ID;
            console.log('Respondent controller respondentID: ', respondentID);
            return {
                results,
                respondentID
            };
        } catch (err) {
            console.log('Respondent controller error: ', err);
            throw err.sqlMessage ?? 'Error';
        }
    }
}

module.exports = RespondentController;