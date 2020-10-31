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

// Get Schema
const Quiz = require('../models/quiz.js');

// Get Scoring Algorithm
var calc_score =  require('../score.js');

// TAKE QUIZ - Function to render quiz that candidate takes ----------------------------- */
function renderQuiz(req, res, next) {
    var token = req.params.token;
    let context = {};
    
    // Find object with id from quizzes data model
    let id = '5f9890f4863f120e60b28b74';
    let id2 = '5f98b85c9a32bc689c5949f3';
    let id3 = '5f9cb1a2fd3e2064587bcee4';

    Quiz.findById(token)
    .exec()
    .then(doc => {
        context = doc;
        // Set layout with paths to css
        context.layout = 'quiz';
        res.render("take-quiz-page", context);
    })
    .catch(err => {
        console.log(err);
        // Set layout with paths to css
        context.layout = 'quiz';
        res.render("404", context);
    });
};

// SCORE QUIZ - Function to score the answers from the candidates choices ----------------------------- */
function scoreQuiz(req, res, next) {
    let context = {};
    context.answers = req.body;
    // Set layout with paths to css
    context.layout = 'quiz';
    context.response_length = Object.keys(req.body).length - 1;
    console.log(context);
    res.render("quiz-submitted-page", context);
};


/* QUIZZES PAGE ROUTES ----------------------------------------------------- */

router.get('/:token', renderQuiz);

router.post('/', scoreQuiz);

module.exports = router;
