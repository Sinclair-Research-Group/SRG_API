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
        //const questionDetails = await this.handleResponse(response);
        // const questionDetails = {
        //     multiple_choice: [],
        //     open_ended: []
        // };
    
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
                teacher_group: response.teacher_group,
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

        // for (let mcQ of questionDetails.multiple_choice) {
        for (let i = 1; i <= 7; i++) {
            // let i = 1;
            // console.log('im in questionDetails.multiple_choice');
            // console.log(`response for mcq_${i}:`);
            // console.log(response[`mcq_${i}`]);
            // console.log('questionDetails.multiple_choice:', questionDetails.multiple_choice);
            // console.log('mcQ:', mcQ);
            // console.log('questionDetails.multiple_choice[mcQ].question_id:', mcQ.question_id);

            // const questionId = mcQ.question_id;
            // const questionDescription = mcQ.question_description;
            let Qweight;

            // console.log('questionId MC:', questionId);
            // console.log('question description MC:', questionDescription);
            
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
                respondent: `${response.first_name}_${response.last_name}`,
                response: response[`mcq_${i}`],
                weight: Qweight
            };

            parsedData.questions.push(question);

            parsedData.question_respondent.push({
                question: `${response[`mcq_${i}`]}_${response[`mcq_${i}_d`]}`,
                survey: response.survey_id,
                respondent: `${response.first_name}_${response.last_name}`
            });
            // i++;
        }

        for (let i = 1; i <= 3; i++) {
            // let i = 1;
            // const questionId = oeQ.question_id;
            // const questionDescription = oeQ.question_description;
            // console.log('im in questionDetails.open_ended');
            // console.log(`response for oeq_${i}:`);
            // console.log(response[`oeq_${i}`]);
            const Qweight = 0;

            // console.log('questionId of open_ended:', questionId);
            // console.log('question_description of mult.choice:', questionDescription);

            const question = {
                description: response[`oeq_${i}_d`],
                survey: response.survey_id,
                respondent: `${response.first_name}_${response.last_name}`,
                response: response[`oeq_${i}`],
                weight: Qweight
            };

            parsedData.questions.push(question);

            parsedData.question_respondent.push({
                question: `${response[`oeq_${i}`]}_${response[`oeq_${i}_d`]}`,
                survey: response.survey_id,
                respondent: `${response.first_name}_${response.last_name}`
            });
        }
        // console.log('end of parsed data, here it is: ', parsedData);
        console.log('made it to the end of parsedData!');
        return parsedData;
    }
}

module.exports = parseSurvey;