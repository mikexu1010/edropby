const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

// User Schema
const UserSchema = mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback){
  User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
  const query = {username: username}
  User.findOne(query, callback);
}

module.exports.validateUsername = function(newUsername, callback){
  var query = {username: newUsername}
  User.findOne(query, callback);
}

module.exports.validateEmail = function(newEmail, callback){
  var query = {email: newEmail}
  User.findOne(query, callback);
}

module.exports.addUser = function(newUser, callback){
  console.log(newUser.username);
  console.log(newUser.name);
  console.log(newUser.email);
  console.log(newUser.password);

  console.log(newUser);


  if(newUser.retypepwd){
    newUser.retypepwd = null;
    console.log("Success???");
    console.log(delete newUser.retypepwd);
  }
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if(err) throw err;
      newUser.password = hash;
      newUser.save(callback);
      console.log("Now..");
      console.log(newUser.retypepwd);
    });
  });
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if(err) console.log (err);
    callback(null, isMatch);
  });
}
