
/**
 * Module dependencies.
 */

var express = require('express'),
	routes = require('./routes'),
	user = require('./routes/user'),
	http = require('http'),
  path = require('path'),
  mongoose = require('mongoose'),
  connectMongo = require('connect-mongo')(express),
  passport = require('passport'),
  GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var SessionStore = require("session-mongoose")(express);
var store = new SessionStore({
    url: "mongodb://localhost/hacksochack",
    interval: 120000 // expiration check worker run interval in millisec (default: 60000)
});console.log(SessionStore);

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
    secret:'hacksochack',
    store: store,
    cookie: { maxAge: 900000 } // expire session in 15 min or 900 seconds
}));
app.use(passport.initialize())
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Passport
passport.use(new GoogleStrategy({
    clientID: '615072913259-bie891gqfruiptbcaorkoipqesdffa92@developer.gserviceaccount.com',
    clientSecret: 'EQYTmOBh1kKUkD5kCtVGscT9',
    callbackURL: 'http://127.0.0.1:3000/auth/google/return'
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's Google profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Google account with a user record in your database,
      // and return that user instead.

      console.log(profile);
      return done(null,profile);
    });
  }
));

/* Kick to life */
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
/* Kick to life */

// Homepage
app.get('/', routes.index);
// Login
app.get('/login', routes.login);
// Google Auth Return
app.get('/auth/google/return', passport.authenticate('google', { 
  scope: [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.google.com/m8/feeds'
  ],
  successRedirect: '/', 
  failureRedirect: '/login' 
}));
// Google Auth Login
app.get('/auth/google', passport.authenticate('google', { 
  scope: [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.google.com/m8/feeds'
  ] 
}));

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
