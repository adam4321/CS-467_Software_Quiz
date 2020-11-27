/******************************************************************************
**  Description: GRAPHIC PAGE - server side node.js routes
**
**  Root path:  localhost:3500/graphic
**
**  Contains:   /
**  
**  SECURED ROUTES!  --  All routes must call checkUserLoggedIn             
******************************************************************************/

const express = require('express');
const router = express.Router();

// Get Schemas
const JobPosting = require('../models/jobposting.js');
const Quiz = require('../models/quiz.js');
const { ObjectId } = require('mongodb');


/* Middleware - Function to Check user is Logged in ------------------------ */
const checkUserLoggedIn = (req, res, next) => {
    req.user ? next(): res.status(401).render('unauthorized-page', {layout: 'login'});
}


/* GRAPHIC PAGE - Function to render user's ranking page ------------------- */
function renderGraphic(req, res, next) {
    let context = {};

    // Find object with id from jobpostings data model
    JobPosting.findOne({'_id': ObjectId(req.query.id)}).lean().exec()
    .then(doc => {
        // Add the Job Posting title to context
        context.title = doc.title;

        // Add the Job Posting _id to context
        context._id = doc._id;

        // Sort the candidate's quiz responses by score and time to break ties
        let temp = doc.quizResponses;

        temp.sort((a, b) => (parseFloat(a.quizScore) < parseFloat(b.quizScore)) ? 1 : 
            (parseFloat(a.quizScore) === parseFloat(b.quizScore)) ?
            ((a.quizEpochTime > b.quizEpochTime) ? 1 : -1) : -1
        );

        context.rankings = temp;

        res.render("graphic-page", context);
    })
    .catch(err => {
        console.error(err);
        res.status(500).render("graphic-page", context);
    });
};


/* RANKING PAGE ROUTES ---------------------------------------------------- */

router.get('/', checkUserLoggedIn, renderGraphic);

module.exports = router;
