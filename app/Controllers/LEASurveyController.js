const dbConnection = require('../../database/mySQLconnect');
//const parseSurveyResponse = require('../../config/parseSurveyResponse.js');
require('dotenv').config();

class LEASurveyController {
    async addLEASurvey(LEASurveyDetails) {
        return new Promise((resolve, reject) => {
            console.log('LEASurveyController LEASurveyDetails:', LEASurveyDetails);
            const LEASurvey = LEASurveyDetails;
            let query = `INSERT IGNORE INTO LEA_Survey 
                         VALUES (?, ?)`;
            dbConnection.query(
                {
                    sql: query,
                    values: [LEASurvey.lea, LEASurvey.survey]
                }, (err, res) => {
                    if(err) {
                        console.log('LEASurveyController error:', err);
                        reject(err.sqlMessage ?? 'Error');
                    }
                    resolve({
                        ...res
                    });
                });
        });
    }
}

module.exports = LEASurveyController;