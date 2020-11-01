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
const JobPosting = require('../models/jobposting.js');

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
    var token = req.params.token;
    let context = {};
    context.answers = req.body;
    // Set layout with paths to css
    context.response_length = Object.keys(req.body).length - 1;

    // TODO: Query quiz associated with object and build quizKey object
    let id3 = '5f9cb1a2fd3e2064587bcee4';
    Quiz.findById(id3)
    .exec()
    .then(quiz_obj => {
        // Set layout with paths to css
        context.layout = 'quiz';
        console.log(context);
        let response_arr = req.body;
        // Score quiz
        calc_score.calculate_score(quiz_obj, response_arr).then(function(score) {
            let total_points = Object.keys(quiz_obj.questions).length;
            let points = (total_points * score) / 100;
            context.total_points = total_points;
            context.points = points;
            // If valid then save the responses and score in jobposting

            // Set layout with paths to css
            context.layout = 'quiz';
            res.render("quiz-submitted-page", context);
        }, function(error) {
            console.log(error);
            // Set layout with paths to css
            context.layout = 'quiz';
            res.render("404", context);
        });
    })
    .catch(err => {
        console.log(err);
        // Set layout with paths to css
        context.layout = 'quiz';
        res.render("404", context);
    });




};


/* QUIZZES PAGE ROUTES ----------------------------------------------------- */

router.get('/:token', renderQuiz);

router.post('/:token', scoreQuiz);

module.exports = router;
