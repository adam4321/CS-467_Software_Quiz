/******************************************************************************
**  Description: QUIZZES PAGE - server side node.js routes
**
**  Root path:  localhost:3500/quizzes
**
**  Contains:   /
**              /delete
**              /download
**              /upload
**
**  SECURED ROUTES!  --  All routes must call checkUserLoggedIn         
******************************************************************************/

const express = require('express');
const router = express.Router();







/* RENDER QUIZZES - Function to render user's quizzes ---------------------- */
function renderQuizzes(req, res, next) {
    let context = {};

            res.status(200).render("quizzes-page", context);

};


/* DELETE QUIZ - Function to delete a quiz from database ------------------- */
function deleteQuiz(req, res, next) {
    let context = {};

        res.status(204).send(context).end();

};


/* DOWNLOAD QUIZ - Function to download a quiz ----------------------------- */
function downloadQuiz(req, res, next) {
    let context = {};

        // Reply to the client
        res.status(200).send(context).end();

};


/* UPLOAD QUIZ - Function to upload a quiz --------------------------------- */
function uploadQuiz(req, res, next) {
    let context = {};

    
                context = saved_quiz;
                res.send(context).end();
};

/* QUIZZES PAGE ROUTES ----------------------------------------------------- */

router.get('/', renderQuizzes);
router.post('/delete', deleteQuiz);
router.post('/download', downloadQuiz);
router.post('/upload', uploadQuiz);

module.exports = router;
