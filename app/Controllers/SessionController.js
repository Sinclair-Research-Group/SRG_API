const dbConnection = require('../../database/mySQLconnect.js');
// const parseSurveyResponse = require('../../config/parseSurveyResponse.js');
require('dotenv').config();

class SessionController {
    async addSession(SessionDetails) {
        return new Promise((resolve, reject) => {
            console.log('SessionController SessionDetails:', SessionDetails);
            const Session = SessionDetails;
            let query = `INSERT INTO Session (session_name, survey, credential_program)
                         VALUES (?, ?, ?)`;
            dbConnection.query(
                {
                    sql: query,
                    values: [Session.session_name, Session.survey, Session.credentialProgram]
                }, (err, res) => {
                    if(err) {
                        console.log('SessionController error:', err);
                        reject(err.sqlMessage ?? 'Error');
                    }
                    resolve({
                        ...res
                    });
                });
        });
    }
}

module.exports = SessionController;