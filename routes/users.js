const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');

// Register
router.post('/register', (req, res, next) => {
  var retypepwd = req.body.retypepwd;

  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
  });

  if(newUser.password !== retypepwd){
    console.log("!!!!!!!!!!!!!!!!!!!!!email2:"+newUser.email2);
    console.log("newUser.retypepwd");
    console.log("newUser.retypepwd");
    console.log(newUser.password);
    console.log("re:"+newUser.retypepwd);
    console.log("re:"+newUser.retypepwd);
    return res.json({success:false, msg: 'password needs to be the same'});
  }else{
    //-------retype password is no longer needed-------
    retypepwd = null;
  }


  //Validate User
  User.validateUsername(newUser.username, (err, user) => {

    if(err) throw err;
    if(user){
      return res.json({success:false, msg: 'User already existed'});
    }

    User.validateEmail(newUser.email, (err, email) => {
      if(err) throw err;
      if(email){
        return res.json({success:false, msg: 'Email already existed'});
      }

      User.addUser(newUser, (err, user) => {
        console.log("executed");
        if(err){
          res.json({success: false, msg:'Failed to register user'});
        } else {
          res.json({success: true, msg:'User registered'});
        }
      });

    });

  });
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) => {
    if(err) throw err;
    if(!user){
      return res.json({success: false, msg: 'User not found'});
    }

    if(!password){
      return res.json({success: false, msg: 'Please enter password'});
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err) throw err;
      if(isMatch){
        const token = jwt.sign(user, config.secret, {
          expiresIn: 604800 // 1 week
        });

        res.json({
          success: true,
          token: 'JWT '+token,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
          }
        });
      } else {
        return res.json({success: false, msg: 'Wrong password'});
      }
    });
  });
});

// Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  res.json({user: req.user});
});

module.exports = router;
