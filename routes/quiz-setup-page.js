/******************************************************************************
**  Description: QUIZ SETUP PAGE - server side node.js routes
**
**  Root path:  localhost:3500/quiz_builder
**
**  Contains:   /
**
**  SECURED ROUTES!  --  All routes must call checkUserLoggedIn              
******************************************************************************/

const express = require('express');
const router = express.Router();





// QUIZ SETUP - Function to render quiz setup page ------------------------- */
function renderSetup(req, res, next) {
    res.status(200).render("quiz-setup-page");
};


/* QUIZ SETUP PAGE ROUTES -------------------------------------------------- */

router.get('/', renderSetup);

module.exports = router;
