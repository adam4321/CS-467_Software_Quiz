/******************************************************************************
**  Description: DASHBOARD HOME / JOB POSTING - server side node.js routes
**
**  Root path:  localhost:3500/dashboard
**
**  Contains:   /
**
**  SECURED ROUTES!  --  All routes must call checkUserLoggedIn        
******************************************************************************/

const express = require('express');
const router = express.Router();
const sgMail = require('@sendgrid/mail');
const jwt = require('jwt-simple');

const mongoose = require('mongoose');
let CRED_ENV;

// Choose credentials for dev or prod
if (process.env.NODE_ENV === 'production'){
    CRED_ENV = process.env;
} else {
    CRED_ENV = require('../credentials.js');
}

sgMail.setApiKey(CRED_ENV.SENDGRID_API_KEY);

// Debug Flag
var DEBUG = 1;
const DEBUG2 = 0;

// Get schemas
const JobPosting = require('../models/jobposting.js');
const Employer = require('../models/employer.js');
const Candidate = require('../models/candidate.js');
const Quiz = require('../models/quiz.js');


// Middleware - Function to Check user is Logged in ------------------------ */
const checkUserLoggedIn = (req, res, next) => {
    req.user ? next(): res.status(401).render('unauthorized-page', {layout: 'login'});
}

// INITIAL DASHBOARD - Function to query schema that is used more than once on the main dashboard --------------- */
function renderPageFromQuery(req, res, next, context, user_id, emp_new){
    // Find  all objects in job postings data model
    JobPosting.find({})
    .exec()
    .then(doc => {
        context.jobposting = doc;
        req.session.jobposting_selected = doc._id;
        // Find all quizzes for the currently logged in user
        Quiz.find({}).lean().where('employer_id').equals(user_id).exec()
        .then(quizzes => {
            // Assign the quiz properties to the context object
            context.quizzes = quizzes;
            if (emp_new === 1){
                req.session.employer_selected = user_id;
                res.status(201).render("dashboard-home", context);
            }
            else{
                req.session.employer_selected = user_id;
                res.status(200).render("dashboard-home", context);
            }     
        })
        .catch(err => {
            console.error(err);
            res.status(500).render("dashboard-home", context);
        });

    })
    .catch(err => {
        console.error(err);
        res.status(404).render("dashboard-home", context);
    });   
}

// INITIAL DASHBOARD - Function to render the main dashboard --------------- */
function renderDashboard(req, res, next) {
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

    // Save new object to database collection
    const emp = new Employer({
        _id: new mongoose.Types.ObjectId,
        email: context.email,
        name: context.name,
        jobPostings: []
    });

    // Check if email is already registered in collection/employers
    var query = Employer.find({});
    query.where('email').equals(req.user.email);
    query.exec()
    .then(result => {
        // No email found
        if (result[0] == undefined) {
            emp.save()
            .then(emp_result => {
                console.log(emp_result);
                renderPageFromQuery(req, res, next, context, emp_result._id, 1);
            })
            .catch(err => {
                console.error(err);
                res.status(500).render("dashboard-home", context);
            });
        }
        else{
            // Email already exists
            renderPageFromQuery(req, res, next, context, result[0]._id, 0);
        }
    })
    .catch(err => {
        console.error(err);
        res.status(500).render("dashboard-home", context);
    });
};

// INITIAL DASHBOARD - Function send quiz link email to the candidate using SendGrid on the main dashboard --------------- */
function sendQuizLinkEmail(req, res, next, msg) {
    console.log(msg);
    if (DEBUG === 0){
        sgMail.send(msg)
        .then(() => {
            console.log('Email sent')
            res.status(200).redirect('/dashboard');
        })
        .catch((error) => {
            console.error(error)
            res.status(500).redirect('/dashboard');
        });
        }
    else{
        res.status(200).redirect('/dashboard');
    }
}

// INITIAL DASHBOARD - Function to process quiz parameters and store candidate details in database on the main dashboard --------------- */
function readEmailForm(req, res, next) {
    
    let first = req.body.first;
    let last = req.body.last;
    let email = req.body.email;
    let job_arr = req.body.jobposting.split(", ");
    let jobposting = job_arr[0];
    let title = job_arr[1];
    let quiz = req.body.quiz;
    var payload = { email: email, jobposting: jobposting, quiz: quiz};
    var token = jwt.encode(payload, CRED_ENV.HASH_SECRET);
    let quiz_link = 'https://softwarecustomquiz.herokuapp.com/take_quiz/'+token;
    let message = first + ' ' + last + ',' +' Please click the following to take the employer quiz '+ quiz_link +' ';
    let html_message = '<strong>' +message + '</strong>';
    let name = 'Invitation to Take ' + title + ' Aptitude Quiz';

    const msg = {
        to: `${email}`, // Recipient
        from: 'software.customquiz@gmail.com', // Verified sender
        subject: `${name}`,
        text: `${message}`,
        html: `${html_message}`,
    }

    // Save new object to database collection
    const cand = new Candidate({
        _id: new mongoose.Types.ObjectId,
        email: email,
        firstName: first,
        lastName: last,
        quizResponseId: []
    });
    // Query jobposting and place quiz in jobposting if not already there in associatedQuiz
    var query = JobPosting.findOne(
        { "associatedQuiz.employer_id": req.session.employer_selected, "associatedQuiz.quiz_id": quiz }, 
        { "associatedQuiz.$": 1 } 
    );
    query.where('_id').equals(jobposting);
    query.exec()
    .then(result => {
    if (DEBUG === 0){
        if (result === null) {
            // Save associated quiz into jobposting selected
            JobPosting.findOneAndUpdate({_id: jobposting}, {useFindAndModify: false}, {
                $push: { associatedQuiz:
                    { 
                        employer_id : req.session.employer_selected,
                        quiz_id : quiz,
                    }
                },
            }, function(error, success) {
                if (error){
                    console.error(error);
                    res.status(500).render("dashboard-home", context);
                }
                else{
                    // Check if email is already registered in collection/employers
                    var query = Candidate.find({});
                    query.where('email').equals(email);
                    query.exec()
                    .then(result => {
                        // No email found
                        if (result[0] == undefined) {
                            cand.save()
                            .then(result => {
                                sendQuizLinkEmail(req, res, next, msg);
                            })
                            .catch(err => {
                                console.error(err);
                                res.status(500).render("dashboard-home", context);
                            });
                        }
                        else{
                            // Email already exists
                            sendQuizLinkEmail(req, res, next, msg);
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        res.status(500).render("dashboard-home", context);
                    });
                }
            });
        }
        else{
            // Associated quiz found
            // Check if email is already registered in collection/employers
            var query = Candidate.find({});
            query.where('email').equals(email);
            query.exec()
            .then(result => {
                // No email found
                if (result[0] == undefined) {
                    cand.save()
                    .then(result => {
                        sendQuizLinkEmail(req, res, next, msg);
                    })
                    .catch(err => {
                        console.error(err);
                        res.status(500).render("dashboard-home", context);
                    });
                }
                else{
                    // Email already exists
                    sendQuizLinkEmail(req, res, next, msg);
                }
            })
            .catch(err => {
                console.error(err);
                res.status(500).render("dashboard-home", context);
            });
        }
    }
    else{
        // Email already exists
        sendQuizLinkEmail(req, res, next, msg);
    }
    })
    .catch(err => {
        console.error(err);
        res.status(500).render("dashboard-home", context);
    });
};

function removeUser(req, res, next) {

    // Check if email is already registered in collection/employers
    var query = Employer.find({});
    query.where('email').equals(req.user.email);
    query.exec()
    .then(result => {
        if(DEBUG2 === 0){
        // No email found
        Employer.deleteOne({'_id': ObjectId(result._id)}).exec()
        .then(() => {
            // Reply to the client
            res.status(204).redirect('/logout');
        })
        .catch(err => {
            console.error(err);
            res.status(500).end();
        });
    }
    else{
        res.redirect('/dashboard.home');
    }
    })
    .catch(err => {
        console.error(err);
        res.status(500).render("dashboard-home", context);
    });

    


};




/*
SAMPLES 
for testing displays of Data Models:
quiz_id: 5f8a4903274de7478c48b4c1
employer_id: 5f87b245e587de4bfc0aca0f
candidate_id: 5f8a4c6cf6f66534c417a374
jpbposting_id: 5f8a4d3ae5e2b93edc72f301
quiz_response_id: 5f8a4d3ae5e2b93edc72f304
*/

/*const cand = new Candidate({
    _id: new mongoose.Types.ObjectId,
    email: "joe.schmoe@email.com",
    firstName: "Joe",
    lastName: "Schmoe",
    quizResponseId: []
});*/

/*const quiz = new Quiz({
    _id: new mongoose.Types.ObjectId,
    questions : [{
        quizQuestion: "How old is the universe?",
        quizAnswers: ["12.8 billion years", "7 billion years", "13.8 billion years", "14.4 billion years"],
        quizKey: "2",
        quizType: "multiple_choice"
    },{
        quizQuestion: "What year did Neil Armstrong walk on the moon?",
        quizAnswers: ["1966", "1969", "1950", "2000"],
        quizKey: "1",
        quizType: "multiple_choice"
    }
    ]
});*/

/*const jobposting = new JobPosting({
_id: new mongoose.Types.ObjectId,
title: "Software Engineer I",
description: "Agile Rockstar",
associatedQuiz : [{
    quiz_id : "5f8a4903274de7478c48b4c1",
    employer_id : "5f87b245e587de4bfc0aca0f"
}],
quizResponses : [{
    quiz_response_id : new mongoose.Types.ObjectId,
    candidate_id : "5f8a4c6cf6f66534c417a374",
    quiz_id : "5f8a4903274de7478c48b4c1",
    candidateAnswers: ["2", "1"],
    quizScore: 100.0
}]
});*/


/* DASHBOARD PAGE ROUTES --------------------------------------------------- */

router.get('/', checkUserLoggedIn, renderDashboard);

router.post('/sendmail', checkUserLoggedIn, readEmailForm);

router.post('/', checkUserLoggedIn, removeUser);

module.exports = router;
