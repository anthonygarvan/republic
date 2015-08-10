var express = require('express');
var request = require('request');
var router = express.Router();
var async = require('async');
var Engine = require('tingodb')()
var mkdirp = require('mkdirp');

var dbPath = __dirname + '/citizenshipdb';
mkdirp(dbPath, function(err) {
  db = new Engine.Db(dbPath, {});
  collection = db.collection("citizens");
})

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to the citizenship api!' });
});

router.post('/apply', function (req, res) {
  if(req.body.url && req.body.citizenTypes) {
    request.post({url:'http://localhost:3000/government/regulation/enforce/url',
      form: {url: req.body.url, citizenTypes: req.body.citizenTypes}},
              function(err,httpResponse,body) {
                result = JSON.parse(body);
                if(result.validCitizenTypes) {
                  async.map(result.validCitizenTypes, function(citizenType, callback) {
                    collection.update({url: req.body.url},
                      {url: req.body.url, citizenType: citizenType},
                      {upsert: true},
                      function(err, result) {callback();});
                      },
                    function(err, result) {
                      res.json({ success: true, validCitizenTypes: validCitizenTypes});
                  });
                }
                else {
                  res.json({success: false});
                }
              });} else {
        res.json({success: false});
      }
});

router.get('/add-collaborator', function (req, res) {
  if(req.query.url && req.query.username) {
    collection.findOne({url: req.query.url}, function(err, citizen) {
      if(citizen.collaborators) {
        citizen.collaborators.push(req.query.username);
      } else {
        citizen.collaborators = [req.query.username];
      }
      collection.update({url: req.query.url},
        citizen,
        function(err, result) {
          res.json({ success: true });
        });
    })
  } else {
    res.json({success: false});
  }
});

router.get('/get-citizen', function (req, res) {
  if(req.query.url) {
    collection.findOne({url: req.query.url}, function(err, citizen) {
      res.json({success: true, citizen: citizen});
    });
  } else {
    res.json({success: false})
  }
});

router.get('/all', function (req, res) {
  collection.find({}).toArray(function(err, citizens) {
    res.json({success: true, citizens: citizens});
  });
});

module.exports = {router: router};
