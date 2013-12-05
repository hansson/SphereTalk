var distance = require('geo-distance');
var models = require('./models');
var gcm = require('./gcm-service');

function findUsers(lon, lat, callback) {
	var users = [];
	users.push({username: "user1"});
	users.push({username: "user2"});
	callback(users);
}

function messageUsers(lon, lat, message, gcmApiKey) {
	//0.015060 = 1km
	var maxLon = lon + 0.015060; 
	var minLon = lon - 0.015060;

	var maxLat = lat + 0.015060; 
	var minLat = lat - 0.015060;

	var myPosition = {
		lon: lon,
		lat: lat
	};

	//Find a box for processing, we do  not want to check all users every time!
	models.User.find({$and: [{ $and: [{lon: {$gt: minLon}}, {lon: {$lt: maxLon}}]},{$and: [{lat: {$gt: minLat}},{lat: {$lt: maxLat}}]}]}, function(err, users) {
		var sendToUsers = [];
		for (var i = users.length - 1; i >= 0; i--) {
			var userPosition = {
				lon: users[i].lon,
				lat: users[i].lat,
			};
			var length = distance.between(myPosition,userPosition);
			if(length <= distance('1 km')) {
				sendToUsers.push(users[i].gcmKey);
			}
		}
		console.log("Using gcm-key: " + gcmApiKey);
		console.log("Sending to: " + sendToUsers);

		gcm.sendGCMMessage(message, sendToUsers, gcmApiKey);
	});
}

exports.findUsers = findUsers;
exports.messageUsers = messageUsers;