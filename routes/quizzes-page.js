/******************************************************************************
**  Description: QUIZZES PAGE - server side node.js routes
**
**  Root path:  localhost:3500/quizzes
**
**  Contains:   /
**
**  SECURED ROUTES!  --  All routes must call checkUserLoggedIn         
******************************************************************************/

const express = require('express');
const router = express.Router();

// Middleware - Function to Check user is Logged in
const checkUserLoggedIn = (req, res, next) => {
    req.user ? next(): res.sendStatus(401);
}


// QUIZZES - Function to render user's quizzes ----------------------------- */
function renderQuizzes(req, res, next) {
    let context = {};

    res.render("quizzes-page", context);
};


/* QUIZZES PAGE ROUTES ----------------------------------------------------- */

router.get('/', checkUserLoggedIn, renderQuizzes);

module.exports = router;
