const dbConnection = require('../../database/mySQLconnect.js');
// const parseSurveyResponse = require('../../config/parseSurveyResponse.js');
require('dotenv').config();

class RespondentController {
    async addRespondent(respondentDetails) {
        return new Promise((resolve, reject) => {
            console.log('Respondent controller respondentDetails:', respondentDetails);
            const Respondent = respondentDetails;
            let query = `INSERT IGNORE INTO Respondent (lea, credential_program, first_name, last_name, teacher_group, program_role, years)
                         VALUES (?, ?, ?, ?, ?, ?, ?)`;
            dbConnection.query(
                {
                    sql: query,
                    values: [Respondent.lea, Respondent.credential_program, Respondent.first_name, Respondent.last_name, Respondent.teacher_group, Respondent.program_role, Respondent.years]
                }, (err, res) => { 
                    if(err) {
                        console.log('Respondent controller error with first insert:', err);
                        reject(err.sqlMessage ?? 'Error');
                    }
                    else {
                        dbConnection.query('SELECT LAST_INSERT_ID() as ID', (err, results) => {
                            if(err) {
                                console.log('Respondent controller error with second insert id:', err);
                                reject(err.sqlMessage ?? 'Error');
                            }
                            const respondentID = results[0]?.ID;
                            console.log('Respondent controller respondentID:', respondentID);
                            resolve({
                                ...res,
                                respondentID
                            });
                        });
                    }
                });
        });
    }
}

module.exports = RespondentController;