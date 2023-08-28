const leaController = new(require('../app/Controllers/LEAcontroller.js'))();
const credentialProgramController = new(require('../app/Controllers/CredentialProgramController.js'))();
const surveyController = new(require('../app/Controllers/SurveyController.js'))();
const respondentController = new(require('../app/Controllers/RespondentController.js'))();
const questionController = new(require('../app/Controllers/QuestionController.js'))();
const leaCredentialProgramController = new(require('../app/Controllers/LEACredentialProgramController.js'))();
const leaSurveyController = new(require('../app/Controllers/LEASurveyController.js'))();
const mentorCandidateController = new(require('../app/Controllers/MentorCandidateController.js'))();
const questionRespondentController = new(require('../app/Controllers/QuestionRespondentController.js'))();
const respondentEmailController = new(require('../app/Controllers/RespondentEmailController.js'))();
const sessionController = new(require('../app/Controllers/SessionController.js'))();
const surveyRespondentController = new(require('../app/Controllers/SurveyRespondentController.js'))();
const teacherGroupController = new(require('../app/Controllers/TeacherGroupController.js'))();
const pool = require('../database/mySQLconnect');
const parseSurvey = require('../config/parseSurveyResponse.js');
const parser = new parseSurvey();

module.exports.handleIncomingSurveyResponse = async function handleIncomingSurveyResponse(response) {
    // parse the incoming survey response data
    const parsedData = await parser.parseSurveyResponse(response);
    // console.log('parsedData: ', parsedData); 

    try {
        const connection = await pool.getConnection();
        // insert the data into the database
        try {
            // start transaction
            await connection.beginTransaction();
            try {
                // If beginTransaction returns a promise, you can await it:
                await connection.beginTransaction();
                console.log('transaction begun successfully');
            } catch (err) {
                console.error('error beginning transaction:', err);
                return;
            }
            
            // 1. insert LEA- this also returns and saves LEA id in lea 
            try {
                const lea = await leaController.addLEA(parsedData.LEA, connection);
                const leaID = lea.leaID;

                // update parsedData LEA ID
                parsedData.LEA.ID = leaID;
                console.log('parsedData.LEA.ID: ', parsedData.LEA.ID);

                parsedData.credentialProgram.lea = leaID;
                parsedData.survey.lea = leaID;
                parsedData.lea_credential_program.lea = leaID;
                parsedData.lea_survey.lea = leaID;
                parsedData.Respondent.lea = leaID;
            } catch (error) {
                console.log('HandleIncomingSurveyResponse: Error with LEA controller', error);
            }

            // 2. insert Credential_Program 
            try {
                await credentialProgramController.addCredentialProgram(parsedData.credentialProgram, connection);
            } catch (error) {
                console.log('HandleIncomingSurveyResponse: Error with Credential_program controller:', error);
            }
            
            // 3. insert Survey
            try {
                await surveyController.addSurvey(parsedData.survey, connection);
            } catch (error) {
                console.log('HandleIncomingSurveyResponse: Error with Survey controller:', error);
            }

            // 11. insert session
            try {
                await sessionController.addSession(parsedData.session, connection);
            } catch (error) {
                console.log('HandleIncomingSurveyResponse: Error with Session controller:', error);
            }

            // 4. insert Respondent 
            try {
                const respondent = await respondentController.addRespondent(parsedData.Respondent, connection);
                const respondentID = respondent.respondentID;
                console.log('respondent: ', respondent);
                console.log('respondent first name: ', parsedData.Respondent.first_name);
                parsedData.Respondent.ID = respondentID;
                parsedData.respondent_email.respondent = respondentID;
                parsedData.survey_respondent.respondent = respondentID; 
            } catch (error) {
                console.log('HandleIncomingSurveyResponse: Error with Respondent controller:', error);
            }

            // 5. insert Question
            for (let i = 0; i < parsedData.questions.length; i++) {
                let questionData = parsedData.questions[i];
                questionData.respondent = parsedData.Respondent.ID;
                try {
                    question = await questionController.addQuestion(questionData, connection);
                } catch (error) {
                    console.log('HandleIncomingSurveyResponse: Error with Question controller:', error);
                }
                let questionID = question.questionID;
                console.log('questionID: ', questionID);

                // For each question, create a QuestionRespondent entry
                const questionRespondentData = {
                    question: questionID,
                    survey: questionData.survey,
                    session: questionData.session,
                    respondent: questionData.respondent,
                };
                
                // 6. insert Question Respondent
                try {
                    await questionRespondentController.addQuestionRespondent(questionRespondentData, connection);
                } catch (error) {
                    console.log('HandleIncomingSurveyResponse: Error with Question_Respondent controller:', error);
                }
            }

            // 7. insert LEA Credential Program
            const leaCredentialProgramData = {
                lea: parsedData.LEA.ID,
                credentialProgram: parsedData.credentialProgram.name
            };
            console.log('leaCredentialProgramData: ', leaCredentialProgramData);

            try {
                await leaCredentialProgramController.addLEACredentialProgram(leaCredentialProgramData, connection);
            } catch (error) {
                console.log('HandleIncomingSurveyResponse: Error with LEACredentialProgram controller:', error);
            }

            // 8. insert LEA Survey 
            const leaSurveyData = {
                lea: parsedData.LEA.ID,
                survey: parsedData.survey.ID
            };

            try {
                await leaSurveyController.addLEASurvey(leaSurveyData, connection);
            } catch (error) {
                console.log('HandleIncomingSurveyResponse: Error with LEASurvey controller:', error);
            }

            const mentorCandidateData = {
                mentor: parsedData.mentor_candidate.mentor,
                candidate: parsedData.mentor_candidate.candidate
            };

            // 9. insert Mentor Candidate 
            try {
                await mentorCandidateController.addMentorCandidate(mentorCandidateData, connection);
            } catch (error) {
                console.log('HandleIncomingSurveyResponse: Error with MentorCandidate controller:', error);
            }

            // 10. insert respondent email
            try {
                await respondentEmailController.addRespondentEmail(parsedData.respondent_email, connection);
            } catch (error) {
                console.log('HandleIncomingSurveyResponse: Error with respondentEmail controller:', error);
            }
            
            // insert respondent teacher group
            for (let i = 0; i < parsedData.teacher_groups.length; i++) {
                let teacherGroupData = parsedData.teacher_groups[i];
                teacherGroupData.respondent = parsedData.Respondent.ID;
                try {
                    await teacherGroupController.addTeacherGroups(teacherGroupData, connection);
                    console.log('HandleIncomingSurveyResponse: teacher group controller successful!');
                } catch (error) {
                    console.log('HandleIncomingSurveyResponse: Error with teacher group controller:', error);
                }
                console.log('Teacher group: ', parsedData.teacher_groups[i]);
            }
            // console.log('how far we make it? not so much');
            // 12. insert survey respondent 
            const surveyRespondentData = {
                survey: parsedData.survey_respondent.survey,
                session: parsedData.survey_respondent.session,
                respondent: parsedData.survey_respondent.respondent
            };
            // console.log('how far we make it?');
            try {
                await surveyRespondentController.addSurveyRespondent(surveyRespondentData, connection);
            } catch (error) {
                console.log('HandleIncomingSurveyResponse: Error with SurveyRespondent controller:', error);
            }
            
            // if everything was successful, commit the transaction
            console.log('everything was successful!');
            await connection.commit();

        } catch (err) {
            // if any error occurred, rollback the transaction
            await connection.rollback();
            console.log('error occured with DB transaction');
            // handle or re-throw the error
            console.error(err);
            throw err;
        } finally {
            console.log('connection is all good, releasing connection from DB');
            connection.release();
        }

    } catch (err) {
        console.log('error connecting DB...');
        console.log(err);
        throw err;
    }
}