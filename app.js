const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const hbs = require('express-handlebars');

// include routes
const index = require('./routes/index');
const users = require('./routes/users');

const app = express();

// view engine setup
app.engine('hbs', hbs({ extname: 'hbs' }));
app.set('view engine', 'hbs');

// import settings from .env file or ENV variables
require('dotenv').config();

// require passport and the GitHub Strategy
const passport = require('passport');
const GithubStrategy = require('passport-github').Strategy;

// use the GitHub strategy with the settings from the .env file
passport.use(new GithubStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: `${process.env.APP_URL}/auth/github/callback`,
    error
  },  
  function(accessToken, refreshToken, profile, done) {
    // this function should take the profile and transform it into a user object.
    // for now we will just pass on the profile object returned by GitHub
    return done(null, profile);
  }
));

// Express and Passport Session
const session = require('express-session');
app.use(session({
  secret: process.env.APP_SECRET || 'abcdefg',
  resave: true,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

// serialize = parse and store data in session
passport.serializeUser(function(user, done) {
  // this function should strip down the user object to something that can be stored in the session
  // for now, we will just use the whole user object but it should probably be just the id
  // null is for errors
  done(null, user);
});

// deserialize = fetch serialized data from session and find the full user object
passport.deserializeUser(function(serializedUser, done) {
  // this function takes the serialized data and should expand it into a full user object
  // for example, maybe you are going to get the user from the database by id?
  // null is for errors
  const user = serializedUser
  done(null, user);
});

// set up other express middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// look for static files in the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// use the route files
app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
