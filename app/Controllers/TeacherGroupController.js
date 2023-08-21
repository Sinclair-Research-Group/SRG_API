require('dotenv').config();

class TeacherGroupController {
    async addTeacherGroups(TeacherGroupDetails, connection) {
        // console.log('RespondentEmailController RespondentEmailDetails:', RespondentEmailDetails);
        const TeacherGroup = TeacherGroupDetails;
        let query = `INSERT INTO Respondent_Teacher_Group
                        VALUES (?, ?)`;
        try {
            const [res] = await connection.query(query, [TeacherGroup.respondent, TeacherGroup.teacher_group]);
            return {
                ...res
            };
        } catch (err) {
            console.log('TeacherGroup Controller error:', err);
            throw err;
        }
    }
}

module.exports = TeacherGroupController;