const koa = require('koa');
const app = new koa();
const bodyParser = require('koa-bodyparser');
const http = require('http');

require('dotenv').config();
app.use(bodyParser());
require('./app/Middleware/CORS.js')(app);

app.use(async (ctx, next) => {
    console.log(`Received request: ${ctx.method} ${ctx.url}`);
    return next().catch((err) => {
        if(err.status === 401) {
            console.log('index.js: sending 401 to the client.');
            ctx.status = 401;
            ctx.body = 'JWT Token expired. If this was an app in production, you do not want to tell the public why their request was rejected!';
        } else {
            console.log('index.js: one of the modules in the chain fired an exception.');
            console.log(`The error message is ${err}`);
        }
    });
});

require('./app/Routers/DefaultRouter.js')(app);

app.listen(process.env.APP_PORT, '0.0.0.0', () => console.log(`Listening on HTTP port ${process.env.APP_PORT}`));

// const httpsServer = require('./config/ssl/ssl.js')(app.callback());
// httpsServer.listen(process.env.APP_PORT, '0.0.0.0', () => console.log(`Listening on HTTPS port ${process.env.APP_PORT}`));
