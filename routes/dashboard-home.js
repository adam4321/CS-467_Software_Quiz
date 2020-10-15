/******************************************************************************
**  Description: DASHBOARD HOME / JOB POSTING - server side node.js routes
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
const Employer = require('../models/employer.js');

// Middleware - Function to Check user is Logged in
const checkUserLoggedIn = (req, res, next) => {
    req.user ? next(): res.status(401).render('unauthorized-page', {layout: 'login'});
}


// INITIAL DASHBOARD - Function to render the main dashboard --------------- */
function renderDashboard(req, res, next) {
    let context = req.user;
    // Test for the auth provider (Google vs Facebook) and create context object
    if (req.user.provider === 'google') {
        context.email = req.user.email;
        context.name = req.user.displayName;
        context.photo = req.user.picture;
    } else {
        context.email = req.user.emails[0].value;
        context.name = req.user.displayName;
        context.photo = req.user.photos[0].value;
    }
    // Save new object to database collection test
    const emp = new Employer({
        _id: new mongoose.Types.ObjectId,
        email: context.email,
        name: context.name
    });
    // Check if email is already registered in collection/employers
    var query = Employer.find({});
    query.where('email').equals(req.user.email);
    query.exec()
    .then(result => {
        // No email found
        if (result[0] == undefined){
            emp.save()
            .then(result => {
                console.log(result);
                res.render("dashboard-home", context);
            })
            .catch(err => {
                console.log(err);
                res.render("dashboard-home", context);
            });
        }
        else{
            console.log("email already exists");
            res.render("dashboard-home", context);
        }
    })
    .catch(err => {
        console.log(err);
        res.render("dashboard-home", context);
    });

    // Find object with id from employers data model
    /*let id = '5f87a534e9b7981d24a6ba3e';
    Employers.findById(id)
    .exec()
    .then(doc => {
        
        // Test for the auth provider (Google vs Facebook) and create context object
        if (req.user.provider === 'google') {
            context.email = req.user.email;
            context.name = req.user.displayName;
            context.photo = req.user.picture;
        } else {
            context.email = req.user.emails[0].value;
            context.name = req.user.displayName;
            context.photo = req.user.photos[0].value;
        }
        //console.log(req.user);
        console.log(doc);
        context.helloworld = doc.email;

        res.render("dashboard-home", context);
    })
    .catch(err => {
        console.log(err);
        res.render("dashboard-home", context);
    });*/
};


/* DASHBOARD PAGE ROUTES --------------------------------------------------- */

router.get('/', checkUserLoggedIn, renderDashboard);

module.exports = router;
