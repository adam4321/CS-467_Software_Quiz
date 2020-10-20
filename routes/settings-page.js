/******************************************************************************
**  Description: SETTINGS - server side node.js routes
**
**  Root path:  localhost:3500/settings
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


// SETTINGS PAGE - Function to render user's settings page ----------------- */
function renderSettings(req, res, next) {
    let context = {};

    res.render("settings-page", context);
};


/* SETTINGS PAGE ROUTES ---------------------------------------------------- */

router.get('/', checkUserLoggedIn, renderSettings);

module.exports = router;
