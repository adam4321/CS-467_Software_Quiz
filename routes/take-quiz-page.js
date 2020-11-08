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
    let context = {};

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
                        // Set layout with paths to css
                        context.layout = 'quiz';
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
                // Set layout with paths to css
                context.layout = 'quiz';
                res.status(500).render("500", context);
            });
    })
    .catch((err) => {
        console.log(err);
        // Set layout with paths to css
        context.layout = 'quiz';
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

    // TODO: Query quiz associated with object and build quizKey object of correct incorrect
    let quiz_testing_id = '5f9cb1a2fd3e2064587bcee4';
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
            // If valid then save the responses and score in jobposting
            console.log(candidate_answers);
            let jobposting_id_testing = '5fa351b5eb104c2c28e611e4';

            console.log(req.session.taker_jobposting);
            if (DEBUG === 0){
                // Capture epoch time in seconds
                const secondsSinceEpoch = Math.round(Date.now() / 1000);
                // Update jobposting wth candidate responses and statistics
                JobPosting.findOneAndUpdate({'_id': ObjectId(req.session.taker_jobposting)}, {useFindAndModify: false}, {
                    $push: { quizResponses:
                        { 
                            quiz_response_id : new mongoose.Types.ObjectId,
                            candidate_id : req.session.taker_id,
                            quiz_id : req.session.taker_quiz,
                            candidateAnswers: candidate_answers,
                            quizComment: comment,
                            quizEpochTime: secondsSinceEpoch,
                            quizTotalTime: 0, // TODO: capture from setInterval
                            quizScore: score
                        }
                    },
                }, function(error, success) {
                    if (error){
                        console.error(error);
                        // Set layout with paths to css
                        context.layout = 'quiz';
                        res.status(500).render("quiz-submitted-page", context);
                    }
                    else{
                        // TODO: email employer after finished with quiz
                        if (DEBUG_EMAIL === 0){
                            const msg = {
                                to: `${email}`, // Recipient
                                from: 'software.customquiz@gmail.com', // Verified sender
                                subject: `${name}`,
                                text: `${message}`,
                                html: `${html_message}`,
                            }

                            sgMail.send(msg)
                            .then(() => {
                                console.log('Email sent to employer')
                                // Set layout with paths to css
                                context.layout = 'quiz';
                                res.status(201).render("quiz-submitted-page", context);
                            })
                            .catch((error) => {
                                console.error(error)
                                // Set layout with paths to css
                                context.layout = 'quiz';
                                res.status(500).render("quiz-submitted-page", context);
                            });
                        }
                        // Set layout with paths to css
                        context.layout = 'quiz';
                        res.status(201).render("quiz-submitted-page", context);
                    }
                });
            }
            else{
                // Set layout with paths to css
                context.layout = 'quiz';
                res.status(200).render("quiz-submitted-page", context);
            }
        }, function(error) {
            console.log(error);
            // Set layout with paths to css
            context.layout = 'quiz';
            res.status(500).render("500", context);
        });
    })
    .catch(err => {
        console.log(err);
        // Set layout with paths to css
        context.layout = 'quiz';
        res.status(404).render("404", context);
    });




};


/* QUIZZES PAGE ROUTES ----------------------------------------------------- */

router.get('/:token', renderQuiz);
router.post('/', scoreQuiz);

module.exports = router;
