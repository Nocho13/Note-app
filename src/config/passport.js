const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const mongoose = require('mongoose');
const User = require('../models/User'); 

passport.use(new LocalStrategy({
  usernameField: 'email'
}, async (email, password, done) => {
  // Match Email's User
  const user = await User.findOne({email: email});
  if (!user) {
    return done(null, false, { message: 'Not User found.' }); // error , objeto , mensaje
  } else {
    // Match Password's User
    const match = await user.matchPassword(password);
    if(match) {
      return done(null, user);
    } else {
      return done(null, false, { message: 'Incorrect Password.' });
    }
  }

}));

passport.serializeUser((user, done) => {
  done(null, user.id);
}); // guardar id en session

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
}); // si hay un usuario logiado , devulvame el usuario 