const dbConnection = require('../../database/mySQLconnect');
// const parseSurveyResponse = require('../../config/parseSurveyResponse.js');
require('dotenv').config();

class MentorCandidateController {
    async addMentorCandidate(MentorCandidateDetails) {
        return new Promise((resolve, reject) => {
            console.log('MentorCandidateController MentorCandidateDetails:', MentorCandidateDetails);
            const MentorCandidate = MentorCandidateDetails;
            let query = `INSERT IGNORE INTO Mentor_Candidate  
                         VALUES (?, ?)`;
            dbConnection.query(
                {
                    sql: query,
                    values: [MentorCandidate.mentor, MentorCandidate.candidate]
                }, (err, res) => {
                    if(err) {
                        console.log('MentorCandidateController error:', err);
                        reject(err.sqlMessage ?? 'Error');
                    }
                    resolve({
                        ...res
                    });
                });
        });
    }
}

module.exports = MentorCandidateController;