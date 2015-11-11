var express = require('express');
var sass    = require('node-sass-endpoint');
var app     = express();

app.get('/app.css',
  sass.serve('./styles/app.scss'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
})

console.log("Listening on port 5555...");
app.listen(5555);
