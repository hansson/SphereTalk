var express = require("express");
var app = express();
var mongoose = require('mongoose');
var models = require('./models');

var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/spheretalk';

mongoose.connect(mongoUri);

app.get('/create', function(request, response) {
  var newUser = new models.User({
    username: 'test',
    geo_location: 'a location'
  });
  newUser.save();
  response.send("ok");
});

app.get('/find', function(request, response) {
  models.User.findOne({username: "test"}, function(err,user) {
    if(err);
    response.send(user.geo_location);
  });
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
