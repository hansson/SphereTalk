var express = require("express");
var app = express();
var MongoClient = require('mongodb').MongoClient, 
  format = require('util').format;  

var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL;

app.get('/', function(request, response) {
  MongoClient.connect(mongoUri, function(err, db) {
    if(err) throw err;
    var response = "";
    var collection = db.collection('test_insert');
    collection.insert({a:2}, function(err, docs) {
                 
      collection.count(function(err, count) {
       response = format("count = %s", count);
      });
                        
      // Locate all the entries using find
      collection.find().toArray(function(err, results) {
        // Let's close the db
        db.close();
        response.send(response)
      });      
    });
  });  
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
