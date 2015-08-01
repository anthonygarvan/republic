var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to the citizenship api!' });
});

router.get('/apply', function (req, res) {
  res.json({ success: true, message: "" });
});

router.get('/add-member', function (req, res) {
  res.json({ success: true, message: "" });
});

router.get('/status', function (req, res) {
  res.json({ success: true, status: "citizen" });
});

router.get('/all', function (req, res) {
  res.json({ success: true, citizens: ["url1", "url2", "url3"] });
});

module.exports = {router: router};
