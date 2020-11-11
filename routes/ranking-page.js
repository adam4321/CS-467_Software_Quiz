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





/* RANKING PAGE - Function to render user's ranking page ------------------- */
function renderRanking(req, res, next) {
    let context = {};

   

            res.render("ranking-page", context);

};


/* RANKING PAGE ROUTES ---------------------------------------------------- */

router.get('/', renderRanking);

module.exports = router;
