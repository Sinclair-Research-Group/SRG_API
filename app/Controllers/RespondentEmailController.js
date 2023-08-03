require('dotenv').config();

class RespondentEmailController {
    async addRespondentEmail(RespondentEmailDetails, connection) {
        // console.log('RespondentEmailController RespondentEmailDetails:', RespondentEmailDetails);
        const Email = RespondentEmailDetails;
        let query = `INSERT IGNORE INTO Respondent_Email 
                        VALUES (?, ?)`;
        try {
            const [res] = await connection.query(query, [Email.email, Email.respondent]);
            return {
                ...res
            };
        } catch (err) {
            console.log('RespondentEmail error:', err);
            throw err;
        }
    }
}

module.exports = RespondentEmailController;