/******************************************************************************
**  Description: QUIZZES PAGE - server side node.js routes
**
**  Root path:  localhost:3500/quizzes
**
**  Contains:   /
**              
******************************************************************************/

const express = require('express');
const router = express.Router();

// Middleware - Function to Check user is Logged in
const checkUserLoggedIn = (req, res, next) => {
    req.user ? next(): res.sendStatus(401);
}


// USER BUGS - Function to render user's bugs ------------------------------ */
function renderQuizzes(req, res, next) {
    let context = {};

    res.render("quizzes-page", context);
};


/* USER HOME PAGE ROUTES --------------------------------------------------- */

router.get('/', checkUserLoggedIn, renderQuizzes);

module.exports = router;
