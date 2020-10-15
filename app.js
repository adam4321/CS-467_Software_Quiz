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
    extname: '.hbs'
}));

// Set up body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set up Mongoose
const mongoose = require('mongoose');

const credentials = require('./MONGODB-credentials.js');

const url = `mongodb+srv://${credentials.MONGO_USER}:${credentials.MONGO_PASSWORD}@cluster0.log5a.gcp.mongodb.net/test`;

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});



/*
mongo.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (err, client) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Mongodb connected\n');

        const db = client.db('QuizSoftTest');
        const collection = db.collection('HelloWorld');

        collection.find().toArray((err, items) => {
            console.log(items)
        })
    }
)*/



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

// QUIZZES PAGE ROUTES
app.use('/quizzes', require('./routes/quizzes-page.js'));

// QUIZ BUILDER PAGE ROUTES
app.use('/quiz_builder', require('./routes/quiz-builder-page.js'));

// SETTINGS PAGE ROUTES
app.use('/settings', require('./routes/settings-page.js'));


/* AUTHENTICATION ROUTES ---------------------------------------------------- */

// REQUEST AUTH
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// POST-AUTH REDIRECT
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login/failed' }),
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
    req.user ? next(): res.status(401).render('unauthorized-page', {layout: 'login'});
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
