/******************************************************************************
**  Description: JOB POSTINGS PAGE - server side node.js routes
**
**  Root path:  localhost:3500/job_postings
**
**  Contains:   /
**              /delete
**  
**  SECURED ROUTES!  --  All routes must call checkUserLoggedIn             
******************************************************************************/

const express = require('express');
const router = express.Router();


/* Middleware - Function to Check user is Logged in ------------------------ */
const checkUserLoggedIn = (req, res, next) => {
    req.user ? next(): res.status(401).render('unauthorized-page', {layout: 'login'});
}


/* POSTINGS PAGE - Function to render user's ranking page ------------------ */
function renderRanking(req, res, next) {
    let context = {};
            res.status(200).render("job-postings-page", context);

};


/* DELETE POSTING - Function to delete a posting from database ------------- */
function deletePosting(req, res, next) {
    let context = {};
        res.status(204).send(context).end();

};


/* RANKING PAGE ROUTES ---------------------------------------------------- */

router.get('/', renderRanking);
router.post('/delete', deletePosting);

module.exports = router;
