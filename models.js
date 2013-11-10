var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  username: String,
  lon: Number,
  lat: Number,
  gcmKey: String,
  lastLogin: {type: Date} 
});
var User = mongoose.model('user', userSchema);

var propertySchema = mongoose.Schema({
	name: String,
	value: String
});
var Property = mongoose.model('property', propertySchema);

exports.User = User;
exports.Property = Property;
