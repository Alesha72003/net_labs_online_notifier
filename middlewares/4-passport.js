const passport = require("passport");
const LocalStrategy = require('passport-local');

// passport.use(new LocalStrategy((username, password, cb) => {} ))

passport.serializeUser((userObj, done) => { done(null, userObj) });
passport.deserializeUser((userObj, done) => { done(null, userObj) });

module.exports = app => {
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(passport.authenticate('session'));
};