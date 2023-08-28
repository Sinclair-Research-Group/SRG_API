const dbConnection = require('../../database/mySQLconnect.js');
// const parseSurveyResponse = require('../../config/parseSurveyResponse.js');
require('dotenv').config();

class SessionController {
    async addSession(SessionDetails, connection) {
        // console.log('SessionController SessionDetails:', SessionDetails);
        const Session = SessionDetails;
        let query = `INSERT IGNORE INTO Session (session_name, survey, credential_program)
                        VALUES (?, ?, ?)`;
        try {
            const [res] = await connection.query(query, [Session.session_name, Session.survey, Session.credentialProgram]);
            return {
                ...res
            };
        } catch (err) {
            console.log('Session error:', err);
            throw err;
        }
    }
}

module.exports = SessionController;