const axios = require('axios');

// Function to retry API call if rate limit is exceeded
async function callApiWithRetry(url, headers, retries = 5) {
  try {
    const response = await axios.get(url, { headers });
    return response;
  } catch (error) {
    if (error.response.status === 429 && retries > 0) {
      const retryAfter = error.response.headers['retry-after'] || 5;
      return new Promise(function(resolve) {
        setTimeout(() => resolve(callApiWithRetry(url, headers, retries - 1)), retryAfter * 1000);
      });
    }
    throw error;
  }
}

// Function to fetch survey details from SurveyMonkey API
async function fetchSurveyDetails(surveyId) {
  console.log('surveyID in fetchSurveyDetails:', surveyId);
  try {
    const url = `https://api.surveymonkey.com/v3/surveys/${surveyId}/details`;
    const headers = {
      'Authorization': 'Bearer X3k4koLgkvsFaCDiOVh-UoVaJUPGHt5qFrprn4yX5tdCRMeQORyuyjVjJnZ9Bs-pEoFpVKD0.dIJa8HMUFPLpTWGm6Tz61ZKTmar0-ZXNY198Tpgo.engL9aan0qKQWv',
      'Content-Type': 'application/json'
    };
    
    const response = await callApiWithRetry(url, headers);
    
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = {
  fetchSurveyDetails
};


// const axios = require('axios');

// // Function to fetch survey details from SurveyMonkey API
// async function fetchSurveyDetails(surveyId) {
//   console.log('surveyID in fetchSurveyDetails:', surveyId);
//   try {
//     const response = await axios({
//       method: 'get',
//       url: `https://api.surveymonkey.com/v3/surveys/${surveyId}/details`,
//       headers: {
//         'Authorization': 'Bearer X3k4koLgkvsFaCDiOVh-UoVaJUPGHt5qFrprn4yX5tdCRMeQORyuyjVjJnZ9Bs-pEoFpVKD0.dIJa8HMUFPLpTWGm6Tz61ZKTmar0-ZXNY198Tpgo.engL9aan0qKQWv',
//         'Content-Type': 'application/json'
//       }
//     });
    
//     return response.data;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// }

// module.exports = {
//   fetchSurveyDetails
// };
