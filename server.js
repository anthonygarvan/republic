var express = require('express');
var government = require('./government/government.js');
var bodyParser = require('body-parser')
var spawn = require('child_process').spawn;

app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.get('/', function (req, res) {
  res.send('Welcome to Republic\'s Home Page!');
});
app.use('/government', government.router);

exports.start = function( config, readyCallback ) {
    if(!this.server) {
        this.server = app.listen( config.port, function() {
            console.log('Server running on port %d', config.port);
            if(readyCallback) {
                readyCallback();
            }
        });
    }
};

exports.close = function() {
    this.server.close();
};

module.exports = exports;
