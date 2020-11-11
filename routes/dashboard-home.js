/******************************************************************************
**  Description: DASHBOARD HOME / JOB POSTING - server side node.js routes
**
**  Root path:  localhost:3500/dashboard
**
**  Contains:   /
**              /sendmail
**              /
**
**  SECURED ROUTES!  --  All routes must call checkUserLoggedIn        
******************************************************************************/

const express = require('express');
const router = express.Router();
const jwt = require('jwt-simple');

// Debug Flag
var DEBUG = 1;
const DEBUG_REMOVE = 1;
const DEBUG_EMAIL = 1;




/* Middleware - Function to Check user is Logged in ------------------------ */
const checkUserLoggedIn = (req, res, next) => {
    req.user ? next(): res.status(401).render('unauthorized-page', {layout: 'login'});
}




/* RENDER DASHBOARD - Function to render the main dashboard --------------- */
function renderDashboard(req, res, next) {
    let context = {};
    res.status(200).render("dashboard-home", context);
    
};





/* INITIAL DASHBOARD - Function to process quiz parameters and store candidate details in database on the main dashboard */
function readEmailForm(req, res, next) {
    res.status(200).redirect('/dashboard');
};


/* DELETE USER - Function to remove a user --------------------------------- */
function removeUser(req, res, next) {
            res.redirect('/dashboard.home');

};


/* DASHBOARD PAGE ROUTES --------------------------------------------------- */

router.get('/', renderDashboard);
router.post('/sendmail', readEmailForm);
router.post('/', removeUser);

module.exports = router;
