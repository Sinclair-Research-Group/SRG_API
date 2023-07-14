const { handleIncomingSurveyResponse } = require('../../config/handleIncomingSurveyResponses.js');

class ZapierController {
    async zapier(ctx) {
        try {
            console.log(ctx.request.body);
            await handleIncomingSurveyResponse(ctx.request.body);
            ctx.status = 200;
            ctx.body = 'Survey response proceeded successfully.';
        } catch (err) {
            console.error(err);
            ctx.status = 500;
            ctx.body = 'Error processing survey response.';
        }
    }
}

module.exports = ZapierController;