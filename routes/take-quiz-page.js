/******************************************************************************
**  Description: TAKE QUIZ PAGE - server side node.js routes
**
**  Root path:  localhost:3500/take_quiz
**
**  Contains:   /
**              /:token
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

// Get Schema
const Quiz = require('../models/quiz.js');
const JobPosting = require('../models/jobposting.js');
const Candidate = require('../models/candidate.js');
const Employer = require('../models/employer.js');

// Get Scoring Algorithm
var calc_score =  require('../score.js');

/* START QUIZ - Function to render the start quiz button that candidate clicks ----------------------------- */
function renderStart(req, res, next) {
    var token = req.params.token;
    var decoded = jwt.decode(token, CRED_ENV.HASH_SECRET);
    let taker_jobposting= decoded.jobposting;
    let context = {};
    JobPosting.findById(ObjectId(taker_jobposting)).lean()
    .exec()
    .then(job_obj => {
        // No candidate response for this quiz yet
        context = job_obj.associatedQuiz[0].quiz;
        // Set layout with paths to css
        context.layout = 'quiz';
        res.status(200).render("start-quiz-page", context);
    })
    .catch((err) => {
        console.log(err);
            res.status(404).render("404", context);
    });

};

/* TAKE QUIZ - Function to render quiz that candidate takes ----------------------------- */
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
    let candidate_id = decoded.cand_id;
    var context = {};

    // Find if the hashed quiz exists already for the hashed job posting and hashed candidate id, 
    // then display already taken if true
    var cand_query = Candidate.find({});
    cand_query.where('_id').equals(candidate_id);
    cand_query.exec()
    .then(cand_result => {
        if (cand_result[0] !== undefined){
            req.session.taker_id = cand_result[0]._id;
            var query = JobPosting.findOne(
                { "quizResponses.candidate_id": ObjectId(cand_result[0]._id), "quizResponses.quiz_id": ObjectId(taker_quiz) }, 
                { "quizResponses.$": 1 } 
            );
            query.where('_id').equals( ObjectId(taker_jobposting) );
            query.exec()            
            .then(job_result => {
                if (job_result === null) {
                    JobPosting.findById(ObjectId(taker_jobposting)).lean()
                    .exec()
                    .then(job_obj => {
                        // No candidate response for this quiz yet
                        context = job_obj.associatedQuiz[0].quiz;
                        // Set layout with paths to css
                        context.layout = 'take_quiz';
                        res.status(200).render("take-quiz-page", context);
                    })
                    .catch((err) => {
                        console.log(err);
                         res.status(404).render("404", context);
                    });
                }
                else{
                    // Set layout with paths to css
                    context.layout = 'take_quiz';
                    res.status(404).render("quiz-taken-error-page", context);
                }
            })
            .catch((err) => {
                console.log(err);
                res.status(500).render("500", context);
            });
        }
        else{
            res.status(500).render("500", context);
        }
    })
    .catch((err) => {
        console.log(err);
        res.status(500).render("500", context);
    });
};


/* SCORE QUIZ - Function to score the answers from the candidates choices ---------------------- */
function scoreQuiz(req, res, next) {
    let context = {};
    // Place comment and answers in context
    context.answers = req.body;
    // Set layout with paths to css
    let response_length = Object.keys(req.body).length - 2;
    context.response_length = response_length;

    JobPosting.findById(ObjectId(req.session.taker_jobposting))
    .exec()
    .then(job_obj => {
        // Set layout with paths to css
        context.layout = 'quiz';
        let response_arr = req.body;
        // Score quiz
        calc_score.calculate_score(job_obj.associatedQuiz[0].quiz, response_arr).then(function(score) {
            // Put responses in array
            let candidate_answers = [];
            for (let y = 0; y < response_length; y++) {
                if (Array.isArray(response_arr[y])) {
                    candidate_answers[y] = response_arr[y];
                }
                else {
                    let ary = [];
                    ary[0] = response_arr[y];
                    candidate_answers.push(ary); 
                }
            }
            // Set commment
            let comment = response_arr.comment;
            // Set total time
            let time_remaining = response_arr.time;
            // Convert total_time to seconds and decrease from time limit
            let total_time_split = time_remaining.split(":");
            let total_time_sec = parseInt(job_obj.associatedQuiz[0].quiz.timeLimit * 60) - (parseInt(total_time_split[0]) * 60 + parseInt(total_time_split[1]));
            // Convert total_time to minutes
            let total_time = parseInt(total_time_sec / 60);
            // Place time taken in context
            context.total_time = total_time;
            console.log();
            console.log(candidate_answers);
            console.log(req.session.taker_jobposting);
            // Capture epoch time in seconds
            const secondsSinceEpoch = Math.round(Date.now() / 1000);
            req.session.quiz_response_id = new mongoose.Types.ObjectId;
            console.log(secondsSinceEpoch);
            // Update jobposting wth candidate responses and statistics
            JobPosting.findByIdAndUpdate(req.session.taker_jobposting, 
            {
                $push: { quizResponses:
                    { 
                        quiz_response_id : req.session.quiz_response_id,
                        quiz_id : req.session.taker_quiz,
                        candidate_id : req.session.taker_id,
                        candidate_email : req.session.taker_email,
                        candidateAnswers: candidate_answers,
                        quizComment: comment,
                        quizEpochTime: secondsSinceEpoch,
                        quizTotalTime: total_time,
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
                    let cand_email = cand_obj.email;
                    // Email employer after finished with quiz
                    Employer.findByIdAndUpdate(req.session.employer_id, {$inc : {'missedMessages' : 1}} ).exec()
                    .then(emp_obj => {
                        let cand_name = req.session.cand_name;
                        let emp_email = emp_obj.email;
                        let emp_name = emp_obj.name;
                        let subject = "Quiz Soft Notification: Response Submitted";
                        let message = `Hello ${emp_name},<br><br>A quiz has been submitted by user ${cand_name} with email contact: ${cand_email}. Visit our website to view the results.`;
                        let html_message = `${message}<br><br><strong>QuizSoft Link:</strong> https://softwarecustomquiz.herokuapp.com/login`;
                        
                        const msg = {
                            to: `${emp_email}`, // Recipient
                            from: 'software.customquiz@gmail.com', // Verified sender
                            subject: `${subject}`,
                            text: `${message}`,
                            html: `${html_message}`,
                        }
                        console.log(msg);
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

            });
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

/* GENERATE TIME STAMP - Function to generate time stamp and put in session from page refresh to track how long page was refreshed ---------------------- */
function generateTimeStamp(req, res, next) {
    req.session.time_stamp = req.body.time_stamp;
}

/* QUIZZES PAGE ROUTES ----------------------------------------------------- */

router.get('/:token', renderStart);
router.get('/:token/quiz', renderQuiz);
router.post('/', scoreQuiz);
router.post('/time_stamp', generateTimeStamp);

module.exports = router;
