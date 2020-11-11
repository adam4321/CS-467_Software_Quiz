/******************************************************************************
**  Description: QUIZ BUILDER PAGE - server side node.js routes
**
**  Root path:  localhost:3500/quiz_create
**
**  Contains:   /
**              /save_quiz
**
**  SECURED ROUTES!  --  All routes must call checkUserLoggedIn              
******************************************************************************/

const express = require('express');
const router = express.Router();




/* QUIZ BUILDER - Function to render quiz builder page --------------------- */
function renderBuilder(req, res, next) {
    res.status(200).render("quiz-builder-page", {layout: 'login'});
};


/* SUBMIT QUIZ - Function to store the completed quiz into the db ---------- */
function submitQuiz(req, res, next) {
    let context = {};

                res.status(201).end();

}


/* QUIZ BUILDER PAGE ROUTES ------------------------------------------------ */

router.get('/', renderBuilder);
router.post('/save_quiz', submitQuiz);

module.exports = router;
