var express = require('express');
var government = require('./government/government.js');
var bodyParser = require('body-parser')

app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//app.use(express.json());       // to support JSON-encoded bodies
//app.use(express.urlencoded()); // to support URL-encoded bodies

app.get('/', function (req, res) {
  res.send('Welcome to Republic\'s Home Page!');
});

app.use('/government', government.router);

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Government is listening at http://%s:%s', host, port);
});
