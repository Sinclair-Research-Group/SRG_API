const questionController = new(require('../app/Controllers/QuestionController.js'))();
const questionRespondentController = new(require('../app/Controllers/QuestionRespondentController.js'))();
const sessionController = new(require('../app/Controllers/SessionController.js'))();
const pool = require('../database/mySQLconnect');
const parseSurvey = require('../config/parseSurveyResponse.js');
const parser = new parseSurvey();

module.exports.handleExcelQuestionDump = async function handleExcelQuestionDump(response) {
    const parsedData = {
        session: {
            session_name: response.session_name,
            survey: response.survey_id,
            credentialProgram: response.credential_program_name
        }
    };
    parsedData.questions = [];
    parsedData.question_respondent = [];

    for (let i = 1; i <= 10; i++) {
        let Qweight;

        if (response.weight_scale == '4_1_scale'){
            if (response[`mcq_${i}_d`] == null) {
                break;
            }
            if (response[`mcq_${i}`] === 'Strongly Agree') {
                Qweight = 4;
            }
            else if (response[`mcq_${i}`] === 'Moderately Agree') {
                Qweight = 3;
            }
            else if (response[`mcq_${i}`] === 'Slightly Agree') {
                Qweight = 2;
            }
            else if (response[`mcq_${i}`] === 'Do not Agree') {
                Qweight = 1;
            }
            else {
                Qweight = 0;
            }
        }
        else if (response.weight_scale == '3_3_scale'){
            if (response[`mcq_${i}_d`] == null) {
                break;
            }
            if (response[`mcq_${i}`] === 'Strongly Agree') {
                Qweight = 3;
            }
            else if (response[`mcq_${i}`] === 'Moderately Agree') {
                Qweight = 2;
            }
            else if (response[`mcq_${i}`] === 'Slightly Agree') {
                Qweight = 1;
            }
            else if (response[`mcq_${i}`] === 'Strongly Disagree') {
                Qweight = -3;
            }
            else if (response[`mcq_${i}`] === 'Moderately Disagree') {
                Qweight = -2;
            }
            else if (response[`mcq_${i}`] === 'Slightly Disagree') {
                Qweight = -1;
            }
            else {
                Qweight = 0;
            }
        }
        else if (response.weight_scale == '2_2_scale'){
            if (response[`mcq_${i}_d`] == null) {
                break;
            }
            if (response[`mcq_${i}`] === 'Strongly Agree') {
                Qweight = 2;
            }
            else if (response[`mcq_${i}`] === 'Agree') {
                Qweight = 1;
            }
            else if (response[`mcq_${i}`] === 'Disagree') {
                Qweight = -1;
            }
            else if (response[`mcq_${i}`] === 'Strongly Disagree') {
                Qweight = -2;
            }
            else {
                Qweight = 0;
            }
        }

        const question = {
            description: response[`mcq_${i}_d`],
            survey: response.survey_id,
            session: response.session_name,
            respondent: response.ID,
            response: response[`mcq_${i}`],
            weight: Qweight
        };

        parsedData.questions.push(question);

        parsedData.question_respondent.push({
            question: `${response[`mcq_${i}`]}_${response[`mcq_${i}_d`]}`,
            survey: response.survey_id,
            session: response.session_name,
            respondent: response.ID
        });
    }

    for (let i = 1; i <= 10; i++) {
        if (response[`oeq_${i}_d`] == null) {
            break;
        }

        const Qweight = 0;

        const question = {
            description: response[`oeq_${i}_d`],
            survey: response.survey_id,
            session: response.session_name,
            respondent: response.ID,
            response: response[`oeq_${i}`],
            weight: Qweight
        };

        parsedData.questions.push(question);

        parsedData.question_respondent.push({
            question: `${response[`oeq_${i}`]}_${response[`oeq_${i}_d`]}`,
            survey: response.survey_id,
            session: response.session_name,
            respondent: response.ID
        });
    }

    try {
        const connection = await pool.getConnection();
        try {
            // start transaction
            await connection.beginTransaction();
            console.log('transaction begun successfully!');

            // check if respondent ID exists, print the ID if it does and give error message otherwise
            const respondentExists = await connection.query('SELECT 1 FROM Respondent WHERE ID = ?', [response.ID]);
            if (!respondentExists || respondentExists[0].length === 0) {
                console.error(`Respondent with ID: ${response.ID} does not exist in the database.`);
                return;
            }
            else {
                console.log('respondent ID: ', response.ID);
            }

            // check if session exists, if so, do nothing, if not, add to the Session table
            const sessionExists = await connection.query('SELECT 1 FROM Session WHERE session_name = ?', [response.session_name]);
            console.log('sessionExists: ', sessionExists);
            if (!sessionExists || sessionExists[0].length === 0) {
                console.log(`Session with name: ${response.session_name} does not exist in the database, lets add it!`);
                // 11. insert session
                try {
                    await sessionController.addSession(parsedData.session, connection);
                } catch (error) {
                    console.log('HandleIncomingSurveyResponse: Error with Session controller:', error);
                }
            }
            else {
                console.log('Session name: ', response.session_name);
            }

            // 5. insert Question
            for (let i = 0; i < parsedData.questions.length; i++) {
                let questionData = parsedData.questions[i];
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