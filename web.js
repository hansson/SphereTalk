var express = require("express");
var app = express();
var mongoose = require('mongoose');
var models = require('./models');
var geo = require('./geo');

var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/spheretalk';

mongoose.connect(mongoUri);

app.use(express.bodyParser());

app.post('/login', function(request, response) {
  var loginResponse = {
    status: "OK",
    users: []
  };

  var username = request.body.username;
  var gcmKey = request.body.gcmKey;
  var geoLocation = request.body.geoLocation;

  if(!username || !gcmKey || !geoLocation) {
    loginResponse.status = "NOT_OK";
    response.send(loginResponse);
    return;
  }

  models.User.find({$or : [{username: username}, {gcmKey: gcmKey}]},function(err, users){
    if(err);
    if(users.length === 0) {
      var newUser = new models.User({
        username: username,
        geoLocation: geoLocation,
        gcmKey: gcmKey,
        lastLogin: Date.now()
      });
      newUser.save();
      geo.findUsers(geoLocation, function(users) {
        loginResponse.users = users;
        response.send(loginResponse);
      });
    } else if(users.length === 1) {
      if(users[0].gcmKey === gcmKey) {
        models.User.update({gcmKey: gcmKey}, {username: username, geoLocation: geoLocation}).exec();
        geo.findUsers(geoLocation, function(users) {
          loginResponse.users = users;
          response.send(loginResponse);
        });
      } else {
        loginResponse.status = "USERNAME_TAKEN";
        response.send(loginResponse);
      }
    } else if(users.length === 2) {
      loginResponse.status = "USERNAME_TAKEN";
      response.send(loginResponse);
    } 
  });
});

app.get('/find', function(request, response) {
  models.User.findOne({username: "test"}, function(err,user) {
    if(err);
    response.send(user.geoLocation);
  });
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
