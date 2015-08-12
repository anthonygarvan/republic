var express = require('express');
app = express();

app.get('/isalive', function (req, res) {
  res.send("OK");
});
/*
app.get('/citizen/details', function (req, res) {
  res.json({"name": "example citizen", "description": "Gettin' up and running"});
});
*/
app.get('/citizen/get-logs', function (req, res) {
  res.json({"logs": ["line1", "line2", "line3"]});
});

var server = app.listen(3004, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Invalid citizen is listening at http://%s:%s', host, port);
});
