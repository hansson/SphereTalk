var distance = require('geo-distance');
var models = require('./models');

function findUsers(lon, lat, callback) {
	var users = [];
	users.push({username: "user1"});
	users.push({username: "user2"});
	callback(users);
}

function messageUsers(lon, lat, message) {
	//0.015060 = 1km
	var maxLon = lon + 0.015060; 
	var minLon = lon - 0.015060;

	var maxLat = lat + 0.015060; 
	var minLat = lat - 0.015060;

	//Find a box for processing, we do  not want to check all users every time!
	models.User.find({$and: [{ $and: [{lon: {$gt: minLon}}, {lon: {$lt: maxLon}}]},{$and: [{lat: {$gt: minLat}},{lat: {$lt: maxLat}}]}]}, function(err, users) {

	});
}

exports.findUsers = findUsers;
exports.messageUsers = messageUsers;