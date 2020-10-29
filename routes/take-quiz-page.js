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

// Middleware - Function to Check user is Logged in
const quizLayout = (req, res, next) => {
    req.user ? next(): res.status(401).render('unauthorized-page', {layout: 'login'});
}


// TAKE QUIZ - Function to render quiz that candidate takes ----------------------------- */
function renderQuiz(req, res, next) {
    let context = {};
    // Find object with id from quizzes data model
    let id = '5f9890f4863f120e60b28b74';
    Quiz.findById(id)
    .exec()
    .then(doc => {
       console.log(doc);
        context = doc;
        context.layout = 'login';
        res.render("take-quiz-page", context);
    })
    .catch(err => {
        console.log(err);
        res.render("take-quiz-page", context);
    });
};


/* QUIZZES PAGE ROUTES ----------------------------------------------------- */

router.get('/', renderQuiz);

module.exports = router;
