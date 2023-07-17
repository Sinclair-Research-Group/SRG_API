/*
|--------------------------------------------------------------------------
| Default router
|--------------------------------------------------------------------------
|
| Default router is used to define any routes that don't belong to a
| controller. Also used as a parent container for the other routers.
|
*/

const router = require('koa-router')({
    prefix: '/api/srg'
});

router.get('/', function (ctx) {
    console.log('router.get(/)');
    return ctx.body = 'Default Router: This is the SRG API!\n';
});

router.post('/test', ctx => {
    console.log('router.post(/test)');
    ctx.body = 'Hello World!';
});

// IMPORT ALL CONTROLLERS
const CredentialProgramController = new(require('../Controllers/CredentialProgramController.js'))();
const LEAController = new(require('../Controllers/LEAcontroller.js'))();
const LEACredentialProgramController = new(require('../Controllers/LEACredentialProgramController.js'))();
const LEASurveyController = new(require('../Controllers/LEASurveyController.js'))();
const MentorCandidateController = new(require('../Controllers/MentorCandidateController.js'));
const QuestionController = new(require('../Controllers/QuestionController.js'));
const QuestionRespondentController = new(require('../Controllers/QuestionRespondentController.js'));
const RespondentController = new(require('../Controllers/RespondentController.js'));
const RespondentEmailController = new(require('../Controllers/RespondentEmailController.js'));
const SessionController = new(require('../Controllers/SessionController.js'));
const SurveyController = new(require('../Controllers/SurveyController.js'));
const SurveyRespondentController = new(require('../Controllers/SurveyRespondentController.js'));
const ZapierController = new(require('../Controllers/ZapierController.js'));

// CREDENTIAL PROGRAM ROUTER
const CredentialProgramRouter = require('koa-router')({
    prefix: '/credentialprogram'
});
// add credential program
CredentialProgramRouter.post('/addCredentialProgram', CredentialProgramController.addCredentialProgram, (err) => {
    console.log(`CredentialProgramController::add program error: ${err}`)
});

// LEA ROUTER
const LEARouter = require('koa-router')({
    prefix: '/LEA'
});
// add lea
LEARouter.post('/addLEA', LEAController.addLEA, (err) => {
    console.log(`LEAController::add LEA error: ${err}`)
});
// add lea credential program
LEARouter.post('/addLEACredentialProgram', LEACredentialProgramController.addLEACredentialProgram, (err) => {
    console.log(`LEACredentialProgramController::add LEA_Credential_Program error: ${err}`)
});
// add lea survey
LEARouter.post('/addLEASurvey', LEASurveyController.addLEASurvey, (err) => {
    console.log(`LEASurveyController::add LEA Survey error: ${err}`)
});

// MENTOR CANDIDATE ROUTER
const MentorCandidateRouter = require('koa-router')({
    prefix: '/MentorCandidate'
});
// add mentor candidate 
MentorCandidateRouter.post('/addMentorCandidate', MentorCandidateController.addMentorCandidate, (err) => {
    console.log(`MentorCandidateController::add mentor candidate error: ${err}`)
});

// QUESTION ROUTER
const QuestionRouter = require('koa-router')({
    prefix: '/Question'
});
// add question
QuestionRouter.post('/addQuestion', QuestionController.addQuestion, (err) => {
    console.log(`QuestionController::add question error: ${err}`)
});
// add question respondent 
QuestionRouter.post('/addQuestionRespondent', QuestionRespondentController.addQuestionRespondent, (err) => {
    console.log(`QuestionRespondentController::add question respondent error: ${err}`)
});

// RESPONDENT ROUTER
const RespondentRouter = require('koa-router')({
    prefix: '/Respondent'
});
// add respondent 
RespondentRouter.post('/addRespondent', RespondentController.addRespondent, (err) => {
    console.log(`RespondentController::add respondent error: ${err}`)
});
// add respondent email
RespondentRouter.post('/addRespondentEmail', RespondentEmailController.addRespondentEmail, (err) => {
    console.log(`RespondentEmailController::add respondent email error: ${err}`)
});

// SESSION ROUTER
const SessionRouter = require('koa-router')({
    prefix: '/Session'
});
// add session
SessionRouter.post('/addSession', SessionController.addSession, (err) => {
    console.log(`SessionController::add session error: ${err}`)
});

// SURVEY ROUTER
const SurveyRouter = require('koa-router')({
    prefix: '/Survey'
});
// add survey
SurveyRouter.post('/addSurvey', SurveyController.addSurvey, (err) => {
    console.log(`SurveyController::add survey error: ${err}`)
});
// add survey respondent 
SurveyRouter.post('/addSurveyRespondent', SurveyRespondentController.addSurveyRespondent, (err) => {
    console.log(`SurveyRespondentController::add survey respondent error: ${err}`)
});

// ZAPIER ROUTER: router linked to Zap
const ZapierRouter = require('koa-router')({
    prefix: '/Zapier'
});
ZapierRouter.post('/addSurveyResponse', ZapierController.zapier, (err) => {
    console.log(`ZapierController::add survey response error: ${err}`)
});


/**
 * Register all of the controllers into the default controller.
 */
 router.use(
    '',
    CredentialProgramRouter.routes(),
    LEARouter.routes(),
    MentorCandidateRouter.routes(),
    QuestionRouter.routes(),
    RespondentRouter.routes(),
    SessionRouter.routes(),
    SurveyRouter.routes(),
    ZapierRouter.routes()
);

module.exports = function (app) {
    app.use(router.routes());
    app.use(router.allowedMethods());
};