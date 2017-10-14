var express = require("express");
var app     = express();
var path    = require("path");
var parser  = require('body-parser');

// Storage 

var messages = [];
var users = [];

console.log(path.join('public'));
app.use(express.static(path.join(__dirname + 'public')))

app.get('/',function(request,response){
  response.sendFile(path.join(__dirname + '\index.html'));
  //__dirname : It will resolve to your project folder.
});

app.get("/stats", function(request, response){
  
});

app.post("/messages", parser.json(), function(request, response){
  console.log('message', JSON.stringify(request.body));
});

app.listen(3000);

console.log("Running at Port 3000");