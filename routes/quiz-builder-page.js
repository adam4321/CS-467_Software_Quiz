/******************************************************************************
**  Description: QUIZ BUILDER PAGE - server side node.js routes
**
**  Root path:  localhost:3500/quiz_builder
**
**  Contains:   /
**
**  SECURED ROUTES!  --  All routes must call checkUserLoggedIn              
******************************************************************************/

const express = require('express');
const router = express.Router();

// Middleware - Function to Check user is Logged in
const checkUserLoggedIn = (req, res, next) => {
    req.user ? next(): res.status(401).render('unauthorized-page', {layout: 'login'});
}


// QUIZ BUILDER - Function to render quiz builder page --------------------- */
function renderBuilder(req, res, next) {
    let context = {};

    res.render("quiz-builder-page", context);
};


/* QUIZ BUILDER PAGE ROUTES ------------------------------------------------ */

router.get('/', checkUserLoggedIn, renderBuilder);

module.exports = router;
