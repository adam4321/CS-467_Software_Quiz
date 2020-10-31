/******************************************************************************
**  Description: QUIZZES PAGE - server side node.js routes
**
**  Root path:  localhost:3500/quizzes
**
**  Contains:   /
**              /delete
**
**  SECURED ROUTES!  --  All routes must call checkUserLoggedIn         
******************************************************************************/

const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

// Get Schemas
const Quiz = require('../models/quiz.js');
const Employer = require('../models/employer.js');


// Middleware - Function to Check user is Logged in ------------------------ */
const checkUserLoggedIn = (req, res, next) => {
    req.user ? next(): res.status(401).render('unauthorized-page', {layout: 'login'});
}


//  RENDER QUIZZES - Function to render user's quizzes --------------------- */
function renderQuizzes(req, res, next) {
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

    // Query the user's quizzes and add them to the context object
    Employer.findOne({email: context.email})
    .exec((err, user) => {
        // Find all quizzes for the currently logged in user
        Quiz.find({}).lean().where('employer_id').equals(user._id).exec()
        .then(quizzes => {
            // Assign the quiz properties to the context object
            context.quizzes = quizzes;
            res.render("quizzes-page", context);
        })
        .catch(err => {
            console.error(err);
            res.render("quizzes-page", context);
        });

    })
};


/* DELETE QUIZ - Function to delete a quiz from database ------------------- */
function deleteQuiz(req, res, next) {
    let context = {};

    // Find the quiz by the id in the request body
    Quiz.deleteOne({'_id': ObjectId(req.body.id)}).exec()
    .then(() => {
        // Reply to the client
        res.send(context);
        res.end();
    })
    .catch(err => {
        console.error(err);
        res.end();
    });
};


/* QUIZZES PAGE ROUTES ----------------------------------------------------- */

router.get('/', checkUserLoggedIn, renderQuizzes);
router.post('/delete', checkUserLoggedIn, deleteQuiz);

module.exports = router;
