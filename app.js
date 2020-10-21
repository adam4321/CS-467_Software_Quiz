/******************************************************************************
**  Description:   Node.js web server for the server-side rendered Software
**                 Quiz employer dashboard. This file is the entry point for
**                 the application.
**
**  Path of forever binary file:    ./node_modules/forever/bin/forever
******************************************************************************/

// Set up express
const express = require('express');
const app = express();

// PORT NUMBER - Set a static port for the appliction 
app.set('port', 3500);

// Set up express-handlebars
const handlebars = require('express-handlebars');
app.set('view engine', '.hbs');
app.engine('.hbs', handlebars({
    layoutsDir: __dirname + '/views/layouts',
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: {
        // Define helpers for this handlebars instance.
        'eq': function () {
            const args = Array.prototype.slice.call(arguments, 0, -1);
            return args.every(function (expression) {
                return args[0] === expression; });
        },
        'quiz_question_expose': function () {
            const args = Array.prototype.slice.call(arguments, 0, -1);
            let obj = args[0];
            return obj.quizQuestion;
        },
        'quiz_answer_expose': function () {
            const args = Array.prototype.slice.call(arguments, 0, -1);
            let obj = args[0].quizAnswers;
            return obj;
        },
        'each_question': function(quiz_obj, max, options) {
            let ary = quiz_obj;
            if((ary.length < max) || ary.length == 0)
                return options.inverse(this);
            var result = [];
            for(var i = 0; i < max; ++i)
                result.push(options.fn(ary[i]));
            return result.join('');
        },
        'each_answer': function(quiz_obj, options) {
            let ary = quiz_obj.quizAnswers;
            if(ary.length == 0)
                return options.inverse(this);
            var result = [];
            for(var i = 0; i < ary.length; ++i)
                result.push(options.fn(ary[i]));
            return result.join('');
        }
    }
}));

// Set up body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set up Mongodb, Mongoose, and authentication credentials
const mongoose = require('mongoose');
let credentials;

// Choose credentials for dev or prod
if (process.env.NODE_ENV === 'production'){
    credentials = process.env;
} else {
    credentials = require('./credentials.js');
}

// Create database url using credentials
const url = `mongodb+srv://${credentials.MONGO_USER}:${credentials.MONGO_PASSWORD}@cluster0.log5a.gcp.mongodb.net/test`;

// Connect to Atlas remote database
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, res) {
    if (err) {
        console.error('ERROR connecting ' + err);
    } else {
        console.log('Successful connection');
    }
});

// Set up path to static files
app.use('/', express.static('public'));

// Set up cookie session and configure session storage
const cookieSession = require('cookie-session');
app.use(cookieSession({
    name: 'session-name',
    keys: ['key1', 'key2']
}))

// Include and configure passport
const passport = require('passport');
require('./passport.js');
app.use(passport.initialize());
app.use(passport.session());


/* PAGE ROUTES -------------------------------------------------------------- */

// LOGIN PAGE ROUTES
app.use('/login', require('./routes/login-page.js'));

// MAIN DASHBOARD PAGE ROUTES
app.use('/dashboard', require('./routes/dashboard-home.js'));

// RANKING PAGE ROUTES
app.use('/ranking', require('./routes/ranking-page.js'));

// QUIZ SETUP PAGE ROUTES
app.use('/quiz_builder', require('./routes/quiz-setup-page.js'));

// QUIZ BUILDER PAGE ROUTES
app.use('/quiz_create', require('./routes/quiz-builder-page.js'));

// QUIZZES PAGE ROUTES
app.use('/quizzes', require('./routes/quizzes-page.js'));


/* AUTHENTICATION ROUTES ---------------------------------------------------- */

// GOOGLE AUTH REQUEST 
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// GOOGLE POST-AUTH REDIRECT
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login/failed' }),
    function(req, res) {
        res.redirect('/dashboard');
    }
);

// FACEBOOK AUTH REQUEST 
app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email'] }));

// FACEBOOK POST-AUTH REDIRECT
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login/failed' }),
    function(req, res) {
        res.redirect('/dashboard');
    }
);

// LOG OUT ROUTE - for all pages
app.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/login');
})


/* ERROR ROUTES ------------------------------------------------------------ */

// Middleware - Function to Check user is Logged in
const checkUserLoggedIn = (req, res, next) => {
    req.user ? next(): res.status(401).render('dashboard-register', {layout: 'login'});
}

// PAGE NOT FOUND - Route for bad path error page
app.use(checkUserLoggedIn, (req, res) => {
    res.status(404).render('404');
});
   
// INTERNAL SERVER ERROR - Route for a server-side error
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).render('500');
});


/* LISTEN ON PORT ---------------------------------------------------------- */

// Set to render on a static port set globally
app.listen(app.get('port'), () => {
    console.log(`\nExpress started at http://localhost:${app.get('port')}/login\nPress ctrl-C to terminate.\n`);
});