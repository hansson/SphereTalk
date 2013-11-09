function findUsers(geoLocation, callback) {
	var users = [];
	users.push({username: "user1"});
	users.push({username: "user2"});
	callback(users);
}

exports.findUsers = findUsers