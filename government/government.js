var express = require('express');
var citizenship = require("./citizenship/citizenship.js");
var election = require("./election/election.js");
var regulation = require("./regulation/regulation.js")

var router = express.Router();

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to the government api!' });
});

router.get('/isalive', function (req, res) {
  res.send('OK');
});

router.use('/citizenship', citizenship.router);
router.use('/election', election.router);
router.use('/regulation', regulation.router);

module.exports = {router: router};
