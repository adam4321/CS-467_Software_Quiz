/******************************************************************************
**  Description: JOBPOSTINGS BUILDER PAGE - server side node.js routes
**
**  Root path:  localhost:3500/job_postings_builder
**
**  Contains:   /
**              /save_job_posting
**
**  SECURED ROUTES!  --  All routes must call checkUserLoggedIn              
******************************************************************************/

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Get schemas
const JobPosting = require('../models/jobposting.js');
const Employer = require('../models/employer.js');


/* Middleware - Function to Check user is Logged in ------------------------ */
const checkUserLoggedIn = (req, res, next) => {
    req.user ? next(): res.status(401).render('unauthorized-page', {layout: 'login'});
}


/* JOBPOSTINGS BUILDER - Function to render jobposting builder page --------------------- */
function renderBuilder(req, res, next) {
    res.status(200).render("job-postings-builder-page", {layout: 'login'});
};


/* SUBMIT JOBPOSTING - Function to store the completed job posting into the db ---------- */
function submitJobPosting(req, res, next) {
    let context = {};

    // Save new object to database collection and associate to employer
    Employer.find({email: req.user.email}).exec()
    .then(doc => {
        
        // Create a new job posting document
        const saved_job_posting = new JobPosting({
            _id: new mongoose.Types.ObjectId,
            employer_id: doc[0]._id,
            title: req.body.title,
            description: req.body.description,
            messageText: req.body.messageText,
            associatedQuiz : [{
                quiz_id : req.body.quiz,
                employer_id : doc[0]._id
            }]
        });

        // Save job posting to the database
        saved_job_posting.save()
        .then(() => {
            res.status(201).end();
        })
        .catch(err => {
            console.error(err);
            res.status(500).end();
        }); 
    })
    .catch(err => {
        console.error(err);
        res.status(404).render("job-postings-page", context);
    });
}


/* JOBPOSTINGS BUILDER PAGE ROUTES ------------------------------------------------ */

router.get('/', checkUserLoggedIn, renderBuilder);
router.post('/save_job_posting', checkUserLoggedIn, submitJobPosting);

module.exports = router;
