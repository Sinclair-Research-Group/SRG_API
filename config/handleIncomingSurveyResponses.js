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
const dbConnection = require('../database/mySQLconnect.js');
const parseSurvey = require('../config/parseSurveyResponse.js');
const parser = new parseSurvey();

module.exports.handleIncomingSurveyResponse = async function handleIncomingSurveyResponse(response) {
    // parse the incoming survey response data
    const parsedData = await parser.parseSurveyResponse(response);

    // get db connection
    dbConnection.getConnection(async (err, connection) => {
        if (err) {
            console.log(err);
            throw err;
        }

        // insert the data into the database
        try {
            // start transaction
            await connection.beginTransaction();

            console.log('handleIncomingSurveyResponse: parsedData.LEA: ', parsedData.LEA);
            
            // 1. insert LEA- this also returns and saves LEA id in lea 
            try {
                const lea = await leaController.addLEA(parsedData.LEA);
                const leaID = lea.leaID;
                // console.log('lea after leaController is called:', lea);
                //console.log('leaID after leaController is called:', leaID);
                // update parsedData LEA ID
                parsedData.LEA.ID = leaID;
                //console.log('LEA after ID is inserted:', parsedData.LEA);
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
                await credentialProgramController.addCredentialProgram(parsedData.credentialProgram);
            } catch (error) {
                console.log('HandleIncomingSurveyResponse: Error with Credential_program controller:', error);
            }
            
            // 3. insert Survey
            try {
                await surveyController.addSurvey(parsedData.survey);
            } catch (error) {
                console.log('HandleIncomingSurveyResponse: Error with Survey controller:', error);
            }

            // 4. insert Respondent 
            try {
                const respondent = await respondentController.addRespondent(parsedData.Respondent);
                //console.log('respondent:', respondent);
                const respondentID = respondent.respondentID;
                //console.log('respondentID:', respondentID);
                // update parsedData Respondent ID
                parsedData.Respondent.ID = respondentID;
                //console.log('ParsedData.Respondent after controller is called and ID is made:', parsedData.Respondent);
                parsedData.respondent_email.respondent = respondentID;
                parsedData.survey_respondent.respondent = respondentID; 
            } catch (error) {
                console.log('HandleIncomingSurveyResponse: Error with Respondent controller:', error);
            }

            // 5. insert Question
            for (let i = 0; i < parsedData.questions.length; i++) {
                const questionData = parsedData.questions[i];
                //console.log('HandleIncomingResponse Question-questionData:', questionData);
                questionData.respondent = parsedData.Respondent.ID;
                //console.log('HandleIncomingResponse Question-questionData AFTER respondent ID inserted:', questionData);
                await questionController.addQuestion(questionData);

                // For each question, create a QuestionRespondent entry
                const questionRespondentData = {
                    question: questionData.ID,
                    survey: questionData.survey,
                    respondent: parsedData.Respondent.ID,
                };
                console.log('HandleIncomingSurveyResponse questionRespondentData:', questionRespondentData);
                // 6. insert Question Respondent
                await questionRespondentController.addQuestionRespondent(questionRespondentData);
            }

            // 7. insert LEA Credential Program
            const leaCredentialProgramData = {
                lea: parsedData.LEA.ID,
                credentialProgram: parsedData.credentialProgram.name
            };

            try {
                await leaCredentialProgramController.addLEACredentialProgram(leaCredentialProgramData);
            } catch (error) {
                console.log('HandleIncomingSurveyResponse: Error with LEACredentialProgram controller:', error);
            }

            // 8. insert LEA Survey 
            const leaSurveyData = {
                lea: parsedData.LEA.ID,
                survey: parsedData.survey.ID
            };

            try {
                await leaSurveyController.addLEASurvey(leaSurveyData);
            } catch (error) {
                console.log('HandleIncomingSurveyResponse: Error with LEASurvey controller:', error);
            }

            const mentorCandidateData = {
                mentor: parsedData.mentor_candidate.mentor,
                candidate: parsedData.mentor_candidate.candidate
            };

            // 9. insert Mentor Candidate 
            try {
                await mentorCandidateController.addMentorCandidate(mentorCandidateData);
            } catch (error) {
                console.log('HandleIncomingSurveyResponse: Error with MentorCandidate controller:', error);
            }

            // 10. insert respondent email
            try {
                await respondentEmailController.addRespondentEmail(parsedData.respondent_email);
            } catch (error) {
                console.log('HandleIncomingSurveyResponse: Error with respondentEmail controller:', error);
            }

            // 11. insert session
            try {
                await sessionController.addSession(parsedData.session);
            } catch (error) {
                console.log('HandleIncomingSurveyResponse: Error with Session controller:', error);
            }

            // 12. insert survey respondent 
            const surveyRespondentData = {
                survey: parsedData.survey.ID,
                respondent: parsedData.Respondent.ID
            };

            try {
                await surveyRespondentController.addSurveyRespondent(surveyRespondentData);
            } catch (error) {
                console.log('HandleIncomingSurveyResponse: Error with SurveyRespondent controller:', error);
            }
            
            // if everything was successful, commit the transaction
            await connection.commit();

        } catch (err) {
            // if any error occurred, rollback the transaction
            await connection.rollback();
            
            // handle or re-throw the error
            console.error(err);
            throw err;
        } finally {
            connection.release();
        }

    });
}