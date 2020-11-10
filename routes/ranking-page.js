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
const JobPosting = require('../models/jobposting.js');
const Candidate = require('../models/candidate.js');
const { ObjectId } = require('mongodb');


/* Middleware - Function to Check user is Logged in ------------------------ */
const checkUserLoggedIn = (req, res, next) => {
    req.user ? next(): res.status(401).render('unauthorized-page', {layout: 'login'});
}


/* RANKING PAGE - Function to render user's ranking page ------------------- */
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

    // // Query the user's quizzes and add them to the context object
    // Employer.findOne({email: context.email})
    // .exec((err, user) => {
    //     // Find all quizzes for the currently logged in user
    //     JobPosting.find({}).lean().where('employer_id').equals(user._id).exec()
    //     .then(postings => {
    //         // Assign the quiz properties to the context object
    //         context.postings = postings;
    //         console.log(context);

    //         res.status(200).render("ranking-page", context);
    //     })
    //     .catch(err => {
    //         console.error(err);
    //         res.status(500).render("ranking-page", context);
    //     });
    // })


    // Find object with id from jobpostings data model
    JobPosting.findOne({'_id': ObjectId(req.query.id)}).lean().exec()
    .then(doc => {
        Candidate.find({}).lean().exec()
        .then(() => {
            console.log(doc)
            context.title = doc.title;
            context.rankings = doc.quizResponses;
            context.quizzes = doc.associatedQuiz;
            console.log(context);

            res.render("ranking-page", context);
        })
    })
    .catch(err => {
        console.error(err);
        res.status(404).render("ranking-page", context);
    });
};


/* RANKING PAGE ROUTES ---------------------------------------------------- */

router.get('/', checkUserLoggedIn, renderRanking);

module.exports = router;
