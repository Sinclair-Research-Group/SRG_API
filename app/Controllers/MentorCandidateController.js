require('dotenv').config();

class MentorCandidateController {
    async addMentorCandidate(MentorCandidateDetails, connection) {
        // console.log('MentorCandidateController MentorCandidateDetails:', MentorCandidateDetails);
        const MentorCandidate = MentorCandidateDetails;
        let query = `INSERT IGNORE INTO Mentor_Candidate  
                    VALUES (?, ?)`;
        try {
            const [res] = await connection.query(query, [MentorCandidate.mentor, MentorCandidate.candidate]);
            return {
                ...res
            };
        } catch (err) {
            console.log('MentorCandidate error:', err);
            throw err;
        } 
    }
}

module.exports = MentorCandidateController;