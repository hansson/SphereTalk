var express = require("express");
var app = express();
var mongoose = require('mongoose');
var models = require('./models');
var geo = require('./geo');
var gcm = require('./gcm-service');


var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/spheretalk';

mongoose.connect(mongoUri);

var gcmApiKey = '';
models.Property.findOne({name: "gcmApiKey"}, function(err, property){
  if(err);
  gcmApiKey = property.value;
  var data = "TESTMESSAGE";
  var regIds = [];
  gcm.sendGCMMessage(data,regIds, gcmApiKey);
});

app.use(express.bodyParser());

app.post('/login', function(request, response) {
  var loginResponse = {
    status: "OK",
    users: []
  };

  var username = request.body.username;
  var gcmKey = request.body.gcmKey;
  var lon = request.body.lon;
  var lat = request.body.lat;

  if(!username || !gcmKey || !lon || !lat) {
    loginResponse.status = "NOT_OK";
    response.send(loginResponse);
    return;
  }

  models.User.find({$or : [{username: username}, {gcmKey: gcmKey}]},function(err, users){
    if(err);
    if(users.length === 0) {
      var newUser = new models.User({
        username: username,
        lon: lon,
        lat: lat,
        gcmKey: gcmKey,
        lastLogin: Date.now()
      });
      newUser.save();
      geo.findUsers(lon, lat, function(users) {
        loginResponse.users = users;
        response.send(loginResponse);
      });
    } else if(users.length === 1) {
      if(users[0].gcmKey === gcmKey) {
        models.User.update({gcmKey: gcmKey}, {username: username, lon: lon, lat: lat, lastLogin: Date.now()}).exec();
        geo.findUsers(lon, lat, function(users) {
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

app.post('/message', function(request, response) {
  var messageResponse = {
    status: "OK"
  };

  var gcmKey = request.body.gcmKey;
  var lon = request.body.lon;
  var lat = request.body.lat;
  var message = request.body.message;

  if(!message || !gcmKey) {
    messageResponse.status = "NOT_OK";
    response.send(messageResponse);
    return;
  }


  models.User.findOne({gcmKey: gcmKey}, function(err, user){
    if(err);
    if(user) {
      if(lon && lat) {
        models.User.update({gcmKey: gcmKey}, {lon: lon, lat: lat}).exec();
      } else {
        lon = user.lon;
        lat = user.lat;
      }
      var chatMessage = {
        message: message,
        user: user.username
      };
      geo.messageUsers(lon, lat, JSON.stringify(chatMessage), gcmApiKey);
    } else {
      messageResponse.status = "NOT_OK";
    }
    response.send(messageResponse);
  });
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});