var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  username: String,
  geoLocation: String,
  gcmKey: String,
  lastLogin: {type: Date} 
});

var User = mongoose.model('user', userSchema);

exports.User = User;
