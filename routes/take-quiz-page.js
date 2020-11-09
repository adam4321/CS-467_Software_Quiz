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
const sgMail = require('@sendgrid/mail');
const jwt = require('jwt-simple');
const { ObjectId } = require('mongodb');

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
var DEBUG = 0;
var DEBUG_EMAIL = 1;

// Get Schema
const Quiz = require('../models/quiz.js');
const JobPosting = require('../models/jobposting.js');
const Candidate = require('../models/candidate.js');
const Employer = require('../models/employer.js');

// Get Scoring Algorithm
var calc_score =  require('../score.js');

// TAKE QUIZ - Function to render quiz that candidate takes ----------------------------- */
function renderQuiz(req, res, next) {
    var token = req.params.token;
    var decoded = jwt.decode(token, CRED_ENV.HASH_SECRET);
    console.log(decoded);
    let taker_email = decoded.email
    req.session.taker_email = taker_email;
    let taker_jobposting= decoded.jobposting;
    req.session.taker_jobposting = taker_jobposting;
    let taker_quiz = decoded.quiz
    req.session.taker_quiz = taker_quiz;
    var context = {};

    // Find if the hashed quiz exists already for the hashed job posting and hashed candidate id, 
    // then display already taken if true
    var cand_query = Candidate.find({});
    cand_query.where('email').equals(taker_email);
    cand_query.exec()
    .then(cand_result => {
            req.session.taker_id = cand_result[0]._id;
            var query = JobPosting.findOne(
                { "quizResponses.candidate_id": ObjectId(cand_result[0]._id), "quizResponses.quiz_id": ObjectId(taker_quiz) }, 
                { "quizResponses.$": 1 } 
            );
            query.where('_id').equals( ObjectId(taker_jobposting) );
            query.exec()            
            .then(job_result => {
                if (job_result === null) {
                    // No candidate response for this quiz yet
                    Quiz.findById(taker_quiz)
                    .exec()
                    .then(doc => {
                        context = doc;
                        // Set layout with paths to css
                        context.layout = 'quiz';
                        res.status(200).render("take-quiz-page", context);
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(404).render("404", context);
                    });
                }
                else{
                    // Set layout with paths to css
                    context.layout = 'quiz';
                    res.status(404).render("quiz-taken-error-page", context);
                }
            })
            .catch((err) => {
                console.log(err);
                res.status(500).render("500", context);
            });
    })
    .catch((err) => {
        console.log(err);
        res.status(500).render("500", context);
    });
};

// SCORE QUIZ - Function to score the answers from the candidates choices ----------------------------- */
function scoreQuiz(req, res, next) {
    let context = {};
    context.answers = req.body;
    // Set layout with paths to css
    let response_length = Object.keys(req.body).length - 1
    context.response_length = response_length;

    Quiz.findById(req.session.taker_quiz)
    .exec()
    .then(quiz_obj => {
        // Set layout with paths to css
        context.layout = 'quiz';
        let response_arr = req.body;
        // Score quiz
        calc_score.calculate_score(quiz_obj, response_arr).then(function(score) {
            let total_points = Object.keys(quiz_obj.questions).length;
            let points = (total_points * score) / 100;
            context.total_points = total_points;
            context.points = points;
            // Put responses in array
            let candidate_answers = [];
            for (let y = 0; y < response_length; y++) {
                if (Array.isArray(response_arr[y])){
                    candidate_answers[y] = response_arr[y];
                }
                else{
                    let ary = [];
                    ary[0] = response_arr[y];
                    candidate_answers.push(ary); 
                }
            }
            // Set commment
            let comment = response_arr[response_length];

            console.log(candidate_answers);
            console.log(req.session.taker_jobposting);
            if (DEBUG === 0){
                // Capture epoch time in seconds
                const secondsSinceEpoch = Math.round(Date.now() / 1000);
                req.session.quiz_response_id = new mongoose.Types.ObjectId;
                console.log(secondsSinceEpoch);
                // Update jobposting wth candidate responses and statistics
                                        // TODO: capture from setInterval
                JobPosting.findByIdAndUpdate(req.session.taker_jobposting, 
                {
                    $push: { quizResponses:
                        { 
                            quiz_response_id : req.session.quiz_response_id,
                            quiz_id : req.session.taker_quiz,
                            candidate_id : req.session.taker_id,
                            candidateAnswers: candidate_answers,
                            quizComment: comment,
                            quizEpochTime: secondsSinceEpoch,
                            quizTotalTime: 0,
                            quizScore: score
                        }
                    }
                },
                {useFindAndModify: false} ).exec()
                .then(job_obj => {
                    if (job_obj.employer !== null){
                        req.session.employer_id = job_obj.employer_id;
                    }
                    // Add quizResponseId to candidate
                    Candidate.findByIdAndUpdate(req.session.taker_id, 
                        {
                            $push: { quizResponseId: req.session.quiz_response_id }
                        },
                    {useFindAndModify: false} ).exec()
                    .then(cand_obj => {
                        if ((cand_obj.firstName !== null) && (cand_obj.lastName !== null)){
                            req.session.cand_name = cand_obj.firstName + " " + cand_obj.lastName;
                        }
                        // Email employer after finished with quiz
                        Employer.findById(req.session.employer_id)
                        .exec()
                        .then(emp_obj => {
                            let cand_name = req.session.cand_name;
                            let emp_email = emp_obj.email;
                            let emp_name = emp_obj.name;
                            let subject = "Quiz Soft Notification: Response Submitted";
                            let message = "Hello, " + emp_name + " a quiz has been submitted by user " + cand_name  + ", visit our website to view the results.";
                            let html_message = '<strong>' + message + '</strong></br><p> QuizSoft Link: https://softwarecustomquiz.herokuapp.com/login</a>';
                            
                            const msg = {
                                to: `${emp_email}`, // Recipient
                                from: 'software.customquiz@gmail.com', // Verified sender
                                subject: `${subject}`,
                                text: `${message}`,
                                html: `${html_message}`,
                            }
                            console.log(msg);
                            if (DEBUG_EMAIL === 0){
                                sgMail.send(msg)
                                .then(() => {
                                    console.log('Email sent to employer')
                                    // Set layout with paths to css
                                    context.layout = 'quiz';
                                    res.status(201).render("quiz-submitted-page", context);
                                })
                                .catch((error) => {
                                    console.error(error)
                                    res.status(500).render("500", context);
                                });
                            }
                            else{
                                // Set layout with paths to css
                                context.layout = 'quiz';
                                res.status(201).render("quiz-submitted-page", context);
                            }

                        })
                        .catch((err) => {
                            console.error(err);
                            res.status(500).render("500", context);
                        })
                    })
                    .catch((err) => {
                        console.error(err);
                        res.status(500).render("500", context);
                    });
                })
                .catch((err)=>{
                    console.error(err);
                    res.status(500).render("500", context);

                })
            }
            else{
                // Set layout with paths to css
                context.layout = 'quiz';
                res.status(200).render("quiz-submitted-page", context);
            }
        }, function(error) {
            console.log(error);
            res.status(500).render("500", context);
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(404).render("404", context);
    });




};


/* QUIZZES PAGE ROUTES ----------------------------------------------------- */

router.get('/:token', renderQuiz);
router.post('/', scoreQuiz);

module.exports = router;
