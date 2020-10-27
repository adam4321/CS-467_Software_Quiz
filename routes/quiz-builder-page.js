/******************************************************************************
**  Description: QUIZ BUILDER PAGE - server side node.js routes
**
**  Root path:  localhost:3500/quiz_create
**
**  Contains:   /
**              /save_quiz
**
**  SECURED ROUTES!  --  All routes must call checkUserLoggedIn              
******************************************************************************/

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Debug constant
DEBUG = 1;

// Get schema
const Quiz = require('../models/quiz.js');

// Middleware - Function to Check user is Logged in
const checkUserLoggedIn = (req, res, next) => {
    req.user ? next(): res.status(401).render('unauthorized-page', {layout: 'login'});
}


// QUIZ BUILDER - Function to render quiz builder page --------------------- */
function renderBuilder(req, res, next) {
    let context = {};

    res.render("quiz-builder-page", {layout: 'login'});
};

// SUBMIT QUIZ - Function to store the completed quiz into the db ---------- */
function submitQuiz(req, res, next) {
    let context = {};

    // TODO - HTTP POST route to submit quiz data
    // Save new object to database collection
    if (req.body.questions.length != 0) {
        const saved_quiz = new Quiz({
            _id: new mongoose.Types.ObjectId,
            name: req.body.name,
            category: req.body.category,
            timeLimit: req.body.timeLimit,
            questions : req.body.questions
        });

        // Save quiz to database and TODO: redirect to myquizzes to display it
        if (DEBUG === 0) {
        saved_quiz.save()
            .then(result => {
                console.log(result);
                var quiz_id_post = saved_quiz._id;
                res.render("quiz-setup-page", context);
            })
            .catch(err => {
                console.log(err);
                res.status(404).end();
            }); 
        }
        else {
            console.log("debug works");
            res.render("quiz-setup-page", context);
        }
    }
    else {
        console.log("No questions in body!!");
    }
}

/* QUIZ BUILDER PAGE ROUTES ------------------------------------------------ */

router.get('/', checkUserLoggedIn, renderBuilder);
router.post('/save_quiz', checkUserLoggedIn, submitQuiz);

module.exports = router;
