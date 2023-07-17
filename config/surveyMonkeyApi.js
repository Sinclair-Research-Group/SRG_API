const axios = require('axios');

// Function to fetch survey details from SurveyMonkey API
async function fetchSurveyDetails(surveyId) {
  console.log('surveyID in fetchSurveyDetails:', surveyId);
  try {
    const response = await axios({
      method: 'get',
      url: `https://api.surveymonkey.com/v3/surveys/${surveyId}/details`,
      headers: {
        'Authorization': 'Bearer X3k4koLgkvsFaCDiOVh-UoVaJUPGHt5qFrprn4yX5tdCRMeQORyuyjVjJnZ9Bs-pEoFpVKD0.dIJa8HMUFPLpTWGm6Tz61ZKTmar0-ZXNY198Tpgo.engL9aan0qKQWv',
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = {
  fetchSurveyDetails
};
