const express = require('express');
const router = express.Router();
const passport = require('passport');

// this function is a middleware (notice req, res, and next?)
function ensureAuthenticated(req, res, next) {
  // it checks to see if the request is from a logged in user and if it is
  if (req.isAuthenticated()) {
    // it will pass the request on to the next middleware in the chain
    // req.user is available for use here
    return next();
  }

  // if the request was not authenticated we redirect to login
  res.redirect('/');
}

// set up a secure route using the 'ensureAuthenticated' function
router.get('/protected', ensureAuthenticated, function(req, res) {
  res.send("access granted. secure stuff happens here");
});

/* GET home page. */
router.get('/', function(req, res, next) {
  let user = '';
  if (req.isAuthenticated()) {
    user = req.user;
  }
  res.render('index', { title: 'Passport Demo', user: user });
});

// handle login link
router.get('/auth/github', passport.authenticate('github'));

// GitHub will call this URL
router.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  }
);

router.get('/logout', function(req, res, next) {
  console.log('logging out');
  req.logout();
  res.redirect('/');
});

module.exports = router;
