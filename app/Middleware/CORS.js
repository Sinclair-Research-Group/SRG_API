const cors = require('kcors');

module.exports = function (app) {
    console.log('In the CORS middleware');
    // Send standard CORS headers with all origins allowed                                                                                                
    app.use(cors({
            credentials: true,
            exposeHeaders: ['Access-Token', 'Cookie']
            }));
};