var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  username: String,
  geo_location: String
});

var User = mongoose.model('user', userSchema);

exports.User = User;
