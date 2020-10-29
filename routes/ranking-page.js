/******************************************************************************
**  Description: RANKING PAGE - server side node.js routes
**
**  Root path:  localhost:3500/ranking
**
**  Contains:   /
**  
**  SECURED ROUTES!  --  All routes must call checkUserLoggedIn             
******************************************************************************/

const express = require('express');
const router = express.Router();

// Get Schemas
const Candidate = require('../models/candidate.js');
const JobPosting = require('../models/jobposting.js');


// Middleware - Function to Check user is Logged in ------------------------ */
const checkUserLoggedIn = (req, res, next) => {
    req.user ? next(): res.status(401).render('unauthorized-page', {layout: 'login'});
}


// RANKING PAGE - Function to render user's ranking page ------------------- */
function renderRanking(req, res, next) {
    let context = {};

    // Test for the auth provider (Google vs Facebook) and create context object
    if (req.user.provider === 'google') {
        context.email = req.user.email;
        context.name = req.user.displayName;
        context.photo = req.user.picture;
    } 
    else {
        context.email = req.user.emails[0].value;
        context.name = req.user.displayName;
        context.photo = req.user.photos[0].value;
    }

    // Find object with id from jobpostings data model
    let id = '5f8a4d3ae5e2b93edc72f301';
    JobPosting.findById(id)
    .exec()
    .then(doc => {
        context.score = doc.quizResponses[0].quizScore;
        context.title = doc.title;
        let id = doc.quizResponses[0].candidate_id;
        Candidate.findById(id)
        .exec()
        .then(cand_doc => {
            context.cand_name = cand_doc.firstName;
            res.render("ranking-page", context);
        })
        .catch(err => {
            console.error(err);
            res.render("ranking-page", context);
        });   
    })
    .catch(err => {
        console.error(err);
        res.render("ranking-page", context);
    });   
};


/* RANKING PAGE ROUTES ---------------------------------------------------- */

router.get('/', checkUserLoggedIn, renderRanking);

module.exports = router;
