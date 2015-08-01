var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to the regulation api!' });
});

router.get('/enforce/all', function (req, res) {
  res.json({ success: true, message: "" });
});

router.get('/enforce/citizen-type', function (req, res) {
  res.json({ success: true, message: "" });
});

router.get('/enforce/url', function (req, res) {
  res.json({ success: true, message: "" });
});

module.exports = {router: router};
