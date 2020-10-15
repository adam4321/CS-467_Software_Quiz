/******************************************************************************
**  Description: DASHBOARD HOME - server side node.js routes
**
**  Root path:  localhost:3500/dashboard
**
**  Contains:   /
**
**  SECURED ROUTES!  --  All routes must call checkUserLoggedIn        
******************************************************************************/

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

// Get schema
const HelloWorld = require('../models/helloworld.js');

// Middleware - Function to Check user is Logged in
const checkUserLoggedIn = (req, res, next) => {
    req.user ? next(): res.status(401).render('unauthorized-page', {layout: 'login'});
}


// INITIAL DASHBOARD - Function to render the main dashboard --------------- */
function renderDashboard(req, res, next) {
    let context = req.user;
    /*// Save new object to database collection helloworlds 
    const hello = new HelloWorld({
        _id: new mongoose.Types.ObjectId,
        email: "words@gmail.com"
    });
    hello.save()
    .then(result => {
        console.log(result);
        res.render("dashboard-home", context);
    })
    .catch(err => {
        console.log(err);
        res.render("dashboard-home", context);
    })*/
    
    // Find object with id from helloworlds
    let id = '5f87a534e9b7981d24a6ba3e';
   HelloWorld.findById(id)
    .exec()
    .then(doc => {
        console.log(doc);
        //console.log(context);

        res.render("dashboard-home", context);
    })
    .catch(err => {
        console.log(err);
        res.render("dashboard-home", context);
    });

};


/* DASHBOARD PAGE ROUTES --------------------------------------------------- */

router.get('/', checkUserLoggedIn, renderDashboard);

module.exports = router;
