/******************************************************************************
**  Description:  Setup file for Google authentication with Oauth2 through
**                passport.js
******************************************************************************/

const GOOG_CREDS = require('./GOOGLE-credentials.js');

const CLIENT_ID = GOOG_CREDS.CLIENT_ID;
const CLIENT_SECRET = GOOG_CREDS.CLIENT_SECRET;
const CALLBACK_URL = GOOG_CREDS.CALLBACK_URL;

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;


passport.serializeUser(function(user, done) {
    done(null, user);
});
  
passport.deserializeUser(function(user, done) {
    done(null, user);
});


passport.use(new GoogleStrategy({
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, cb) {
    return cb(null, profile);
  }
));
