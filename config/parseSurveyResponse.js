const { fetchSurveyDetails } = require('../config/surveyMonkeyApi.js');

class parseSurvey {

    async handleResponse(response) {
        const surveyDetails = await fetchSurveyDetails(response.survey_id);
        // console.log('SurveyDetails:', surveyDetails);
        const questionDetails = {
            multiple_choice: [],
            open_ended: []
        };

        for (let page of surveyDetails.pages) {
            if (page.title === 'Professional Learning (PL) Session Quantitative Ratings (Strongly Agree to Strongly Disagree)') {
                for (let question of page.questions) {
                    if (question.id && question.answers && question.answers.rows) {
                        for (let row of question.answers.rows) {
                            questionDetails.multiple_choice.push({
                                question_description: row.text,
                                question_id: row.id
                            });
                        }
                    }
                }
            }
            else if (page.title === 'Open-ended Qualitative Questions') {
                for (let question of page.questions) {
                    if (question.id) {
                        questionDetails.open_ended.push({
                            question_description: question.headings[0].heading,
                            question_id: question.id
                        });
                    }
                }
            }
        }
    
        return questionDetails; 
    }
    
    async parseSurveyResponse(response) {   

        const parsedData = {
            LEA: {
                name: response.lea_name,
                lead_LEA: response.lead_lea
            },
            credentialProgram: {
                name: response.credential_program_name,
                lea: response.lea_name,
                year: response.credential_program_year
            },
            survey: {
                ID: response.survey_id,
                credential_program: response.credential_program_name,
                lea: response.lea_name,
                name: response.survey_name
            },
            Respondent: {
                lea: response.lea_name,
                credential_program: response.credential_program_name,
                first_name: response.first_name,
                last_name: response.last_name,
                program_role: response.program_role,
                years: response.years
            },
            lea_survey: {
                lea: response.lea_name,
                survey: response.survey_id
            },
            lea_credential_program: {
                lea: response.lea_name,
                credential_program: response.credential_program_name
            },
            survey_respondent: {
                survey: response.survey_id,
                session: response.session_name,
                respondent: `${response.first_name}_${response.last_name}`
            },
            mentor_candidate: {
                mentor: response.mentor,
                candidate: response.candidate
            },
            session: {
                session_name: response.session_name,
                survey: response.survey_id,
                credentialProgram: response.credential_program_name
            },
            respondent_email: {
                email: response.email,
                respondent: `${response.first_name}_${response.last_name}`
            }
        };
    
        parsedData.questions = [];
        parsedData.question_respondent = [];
        parsedData.teacher_groups = [];

        for (let i = 1; i <= 15; i++) {
            //console.log('parsesSurveyResponse: teacher group:', response[`teacher_group_${i}`] )
            if (response[`teacher_group_${i}`] == null) { 
                //console.log('parsesSurveyResponse: teacher group is null')
                break;
            }
            else {
                //console.log('parsesSurveyResponse: teacher group is NOT null')
                const teacher_group = {
                    respondent: `${response.first_name}_${response.last_name}`,
                    teacher_group: response[`teacher_group_${i}`]
                }
                parsedData.teacher_groups.push(teacher_group);
            }
        }

        for (let i = 1; i <= 10; i++) {
            let Qweight;
            
            if (response[`mcq_${i}_d`] === null) {
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

            const question = {
                description: response[`mcq_${i}_d`],
                survey: response.survey_id,
                session: response.session_name,
                respondent: `${response.first_name}_${response.last_name}`,
                response: response[`mcq_${i}`],
                weight: Qweight
            };

            parsedData.questions.push(question);

            parsedData.question_respondent.push({
                question: `${response[`mcq_${i}`]}_${response[`mcq_${i}_d`]}`,
                survey: response.survey_id,
                session: response.session_name,
                respondent: `${response.first_name}_${response.last_name}`
            });
        }

        for (let i = 1; i <= 10; i++) {
            if (response[`oeq_${i}_d`] === null) {
                break;
            }

            const Qweight = 0;

            const question = {
                description: response[`oeq_${i}_d`],
                survey: response.survey_id,
                session: response.session_name,
                respondent: `${response.first_name}_${response.last_name}`,
                response: response[`oeq_${i}`],
                weight: Qweight
            };

            parsedData.questions.push(question);

            parsedData.question_respondent.push({
                question: `${response[`oeq_${i}`]}_${response[`oeq_${i}_d`]}`,
                survey: response.survey_id,
                session: response.session_name,
                respondent: `${response.first_name}_${response.last_name}`
            });
        }
        console.log('made it to the end of parsedData!');
        return parsedData;
    }
}

module.exports = parseSurvey;