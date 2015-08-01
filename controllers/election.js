var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to the election api!' });
});

router.get('/vote', function (req, res) {
  res.json({ success: true, message: "" });
});

router.get('/run-for-office', function (req, res) {
  res.json({ success: true, message: "" });
});

router.get('/details', function (req, res) {
  res.json({ success: true, message: "" });
});

router.get('/representative/all', function (req, res) {
  res.json({ success: true, message: "" });
});

module.exports = {router: router};
