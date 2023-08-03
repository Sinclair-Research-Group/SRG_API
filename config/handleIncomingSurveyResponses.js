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
const pool = require('../database/mySQLconnect');
const parseSurvey = require('../config/parseSurveyResponse.js');
const parser = new parseSurvey();

module.exports.handleIncomingSurveyResponse = async function handleIncomingSurveyResponse(response) {
    // parse the incoming survey response data
    console.log('Once upon a time...');
    const parsedData = await parser.parseSurveyResponse(response);
    // try {
    //     const parsedData = await parser.parseSurveyResponse(response);
    //     console.log('in the try');
    // } catch (error) {
    //     console.log('error with parseSurveyResponse');
    // }
    console.log('am i the drama?');
    // console.log('db connection: ', dbConnection);
    // get db connection
        // console.log('im at the top of the db connection');
        // if (err) {
        //     console.log('shit. error connecting...');
        //     console.log(err);
        //     // throw err;
        //     return;
        // }
        // console.log('db connected successfully!');
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
            // console.log('we literally just started...');

            // console.log('handleIncomingSurveyResponse: parsedData.LEA: ', parsedData.LEA);
            
            // 1. insert LEA- this also returns and saves LEA id in lea 
            try {
                const lea = await leaController.addLEA(parsedData.LEA, connection);
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
            // console.log('how far we make it?');

            // 4. insert Respondent 
            try {
                const respondent = await respondentController.addRespondent(parsedData.Respondent, connection);
                console.log('respondent after calling controller: ', respondent);
                //console.log('respondent:', respondent);
                const respondentID = respondent.respondentID;
                console.log('respondentID: ', respondentID);
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
                question = await questionController.addQuestion(questionData, connection);
                console.log('question after calling question controller: ', question);
                questionId = question.questionId;
                console.log('questionId: ', questionId);
                // For each question, create a QuestionRespondent entry
                const questionRespondentData = {
                    question: questionId,
                    survey: questionData.survey,
                    respondent: parsedData.Respondent.ID,
                };
                // console.log('HandleIncomingSurveyResponse questionRespondentData:', questionRespondentData);
                // 6. insert Question Respondent
                await questionRespondentController.addQuestionRespondent(questionRespondentData, connection);
            }

            // 7. insert LEA Credential Program
            const leaCredentialProgramData = {
                lea: parsedData.LEA.ID,
                credentialProgram: parsedData.credentialProgram.name
            };

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
            // console.log('how far we make it?');

            // 11. insert session
            try {
                await sessionController.addSession(parsedData.session, connection);
            } catch (error) {
                console.log('HandleIncomingSurveyResponse: Error with Session controller:', error);
            }
            // console.log('how far we make it? not so much');
            // 12. insert survey respondent 
            const surveyRespondentData = {
                survey: parsedData.survey.ID,
                respondent: parsedData.Respondent.ID
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
            console.log('error occured');
            
            // handle or re-throw the error
            console.error(err);
            throw err;
        } finally {
            console.log('connection is all good, releasing connection from DB');
            connection.release();
        }

    } catch (err) {
        console.log('error connecting...');
        console.log(err);
        throw err;
    }
}