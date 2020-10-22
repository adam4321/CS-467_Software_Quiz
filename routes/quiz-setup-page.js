/******************************************************************************
**  Description: QUIZ SETUP PAGE - server side node.js routes
**
**  Root path:  localhost:3500/quiz_builder
**
**  Contains:   /
**
**  SECURED ROUTES!  --  All routes must call checkUserLoggedIn              
******************************************************************************/

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const url = require('url'); 

// Get schema
const Quiz = require('../models/quiz.js');

// Middleware - Function to Check user is Logged in
const checkUserLoggedIn = (req, res, next) => {
    req.user ? next(): res.status(401).render('unauthorized-page', {layout: 'login'});
}


// QUIZ SETUP - Function to render quiz setup page --------------------- */
function renderSetup(req, res, next) {
    let context = {};

    res.render("quiz-setup-page", context);
};


/* QUIZ SETUP PAGE ROUTES ------------------------------------------------ */

router.get('/', checkUserLoggedIn, renderSetup);

router.post('/', checkUserLoggedIn, (req, res) => {
    // Save new object to database collection
    init_quiz = new Quiz({
        _id: new mongoose.Types.ObjectId,
        name: req.body.quiz_title,
        category: req.body.category,
        timeLimit: req.body.time_limit
    });

    init_quiz.save()
    .then(result => {
        console.log(result);
        var quiz_id_post = init_quiz._id;
        res.redirect(url.format({
            pathname:"/quiz_create",
            query: {
               "id":`${quiz_id_post}`
             }
          }));
    })
    .catch(err => {
        console.log(err);
        res.status(404).end();
    });
    
});

module.exports = router;
