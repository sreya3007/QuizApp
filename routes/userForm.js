const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');

// Load User model
const User = require('../models/user.js');// .. two dots for going outside present folder
const { forwardAuthenticated } = require('../configs/auth');


// Login Page
router.get('/login', forwardAuthenticated, (req, res) => {
    res.render('login.ejs')
});


// Register Page
router.get('/signup', forwardAuthenticated, (req, res) => {
    res.render('signUp.ejs')
});

// Register
router.post('/signup', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  // validating the user
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });//these errors will be flashed in case this certain error
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('signUp', {
      errors, // this to display the errors and redirects back to signup page
      name, // we wont completely clear the fields in case of an error
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('signUp.ejs', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        // read about this nicely its asked in interviews
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash; // now instead of palin text we will have hashed password saved in the database
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/auth/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dasboard',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/login');
});

module.exports = router;