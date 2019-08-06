const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');

//Load User Model
require('../models/User');
const User = mongoose.model('users');

// ------ Users page --------
router.get('/userdashboard', ensureAuthenticated, (req, res) => {
  User.find(function(err, users) {
      res.render('users/admin', {
        users: users
    });
    })
});

// ----- User Login -----
router.get('/login', (req, res) => {
    res.render('users/login');
});

// ----- Registration -----
router.get('/register', (req, res, next) => {
  res.render('users/register');
});

// Edit User Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  User.findOne({
      _id: req.params.id
  })
  .then(user => {
      res.render('users/edit', {
        user: user
      });
  });
});

// Edit form process
router.put('/userdashboard/:id', (req, res) => {
  User.findOne({
      _id: req.params.id
  })
  .then(user => {
      //new value
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
      user.email = req.body.email;
      user.save()
      .then(user => {
          req.flash('success_msg', 'User has been updated')
          res.redirect('/users/userdashboard');
      });
  });
});

// Login Form POST
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/hotdogs',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next)
})

// Register form POST
router.post('/register', (req, res) => {
  let errors = [];

  if(req.body.password != req.body.password2){
    errors.push({text:"Passwords don't match"})
  }
  if(req.body.password.length < 5){
    errors.push({text:"Password must be at least 5 characters"})
  }
  if(errors.length > 0){
    res.render('users/register', {
      errors: errors,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    User.findOne({email: req.body.email})
    .then(user => {
      if(user){
        req.flash('error_msg', 'Email is already registered');
        res.redirect('/users/register');
      } else {
        const newUser = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: req.body.password
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            newUser.password = hash;
            newUser.save()
            .then(user =>{
              req.flash('success_msg', 'You are now registered and can login');
              res.redirect('/users/login');
            })
            .catch(err => {
              console.log(err);
              return;
            });
          });
        });
      }
    });
  }
});

// Delete User
router.delete('/:id', (req, res) => {
  User.deleteOne({_id: req.params.id})
  .then(() => {
      req.flash('success_msg', 'User has been removed')
      res.redirect('/users/userdashboard');

  })
})

// Logout user
router.get('/logout', (req, res) => {
  req.logOut();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;