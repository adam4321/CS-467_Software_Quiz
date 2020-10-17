/******************************************************************************
**  Description: QUIZZES PAGE - server side node.js routes
**
**  Root path:  localhost:3500/quizzes
**
**  Contains:   /
**
**  SECURED ROUTES!  --  All routes must call checkUserLoggedIn         
******************************************************************************/

const express = require('express');
const router = express.Router();

// Get Schema
const Quiz = require('../models/quiz.js');

// Middleware - Function to Check user is Logged in
const checkUserLoggedIn = (req, res, next) => {
    req.user ? next(): res.status(401).render('unauthorized-page', {layout: 'login'});
}


// QUIZZES - Function to render user's quizzes ----------------------------- */
function renderQuizzes(req, res, next) {
    let context = {};
    // Find object with id from quizzes data model
    let id = '5f8a4903274de7478c48b4c1';
    Quiz.findById(id)
    .exec()
    .then(doc => {
       //console.log(doc);
        context.questions = doc.questions;
        res.render("quizzes-page", context);
    })
    .catch(err => {
        console.log(err);
        res.render("quizzes-page", context);
    });
};


/* QUIZZES PAGE ROUTES ----------------------------------------------------- */

router.get('/', checkUserLoggedIn, renderQuizzes);

module.exports = router;
