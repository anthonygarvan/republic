var express = require('express');
var government = require('./controllers/government');
app = express();

app.get('/', function (req, res) {
  res.send('Welcome to Republic\'s Home Page!');
});

app.use('/government', government.router);

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Government is listening at http://%s:%s', host, port);
});
