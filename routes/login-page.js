/******************************************************************************
**  Description: LOGIN PAGE - server side node.js routes
**
**  Root path:  localhost:3500/login
**
**  Contains:   /
**              /failed
**              
**  UNSECURED ROUTES!
******************************************************************************/

const express = require('express');
const router = express.Router();


// USER BUGS - Function to render user's bugs ------------------------------ */
function renderLogin(req, res, next) {
    let context = {};

    res.render("login-page", {layout: 'login'});
};


// USER BUGS - Function to render user's bugs ------------------------------ */
function renderFailedLogin(req, res, next) {
    let context = {};

    res.render("login-failed-page", {layout: 'login'});
};


/* USER HOME PAGE ROUTES --------------------------------------------------- */

router.get('/', renderLogin);
router.get('/failed', renderFailedLogin);

module.exports = router;
