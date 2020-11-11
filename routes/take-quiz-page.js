/******************************************************************************
**  Description: TAKE QUIZ PAGE - server side node.js routes
**
**  Root path:  localhost:3500/take_quiz
**
**  Contains:   /
**       
******************************************************************************/

const express = require('express');
const router = express.Router();
const jwt = require('jwt-simple');



// Debug Flag
var DEBUG = 1;
var DEBUG_EMAIL = 1;

// Get Scoring Algorithm
var calc_score =  require('../score.js');

// TAKE QUIZ - Function to render quiz that candidate takes ----------------------------- */
function renderQuiz(req, res, next) {
    var token = req.params.token;
    var decoded = jwt.decode(token, CRED_ENV.HASH_SECRET);
    console.log(decoded);
    let taker_email = decoded.email
    req.session.taker_email = taker_email;
    let taker_jobposting= decoded.jobposting;
    req.session.taker_jobposting = taker_jobposting;
    let taker_quiz = decoded.quiz
    req.session.taker_quiz = taker_quiz;
    var context = {};

   
                        res.status(200).render("take-quiz-page", context);
               
};

// SCORE QUIZ - Function to score the answers from the candidates choices ----------------------------- */
function scoreQuiz(req, res, next) {
    let context = {};
    context.answers = req.body;
    // Set layout with paths to css
    let response_length = Object.keys(req.body).length - 2;
    context.response_length = response_length;


                                    context.layout = 'quiz';
                                    res.status(201).render("quiz-submitted-page", context);



};


/* QUIZZES PAGE ROUTES ----------------------------------------------------- */

router.get('/:token', renderQuiz);
router.post('/', scoreQuiz);

module.exports = router;
