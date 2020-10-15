/******************************************************************************
**  Description: RANKING PAGE - server side node.js routes
**
**  Root path:  localhost:3500/ranking
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


// RANKING PAGE - Function to render user's ranking page ----------------- */
function renderRanking(req, res, next) {
    let context = {};

    res.render("ranking-page", context);
};


/* RANKING PAGE ROUTES ---------------------------------------------------- */

router.get('/', checkUserLoggedIn, renderRanking);

module.exports = router;
