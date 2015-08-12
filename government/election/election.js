var express = require('express');
var mkdirp = require('mkdirp');
var fs = require('fs');
var Engine = require('tingodb')();
var router = express.Router();
var async = require('async');

var dbPath = __dirname + '/electiondb';
mkdirp.sync(dbPath)
db = new Engine.Db(dbPath, {});
representatives = db.collection("representatives");
votes = db.collection("votes")
representatives.ensureIndex({"Title": 1}, {"unique": true});

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to the election api!' });
});

router.get('/get-representatives', function (req, res) {
  representatives.find({}).toArray(function(err, reps) {
    if(reps.length === 0) {
      fs.readFile(__dirname + '/bootstrap_representatives.json',
        'utf8', function (err, data) {
            reps = JSON.parse(data).representatives;
            async.map(reps, function(rep, callback) {
              representatives.insert(rep, function(err) {
                callback();
              });},
              function(err, reponse) {
                representatives.find({}).toArray(function(err, reps) {
                  res.json({success: true, "representatives": reps});                })
              });}
            );
      } else {
        res.json({success: true, "representatives": reps});
      }});
});

router.get('/remove-representatives', function (req, res) {
  representatives.remove();
  res.json({success: true});
});

router.get('/vote', function (req, res) {
  if(req.query.title && req.query.username) {
    representatives.find({}).toArray(function(err, reps) {
      var titles = [];
      reps.forEach(function(rep) {
        titles.push(rep.title);
      });
      if(titles.indexOf(req.query.title) >= 0) {
        var vote = {title: req.query.title, username: req.query.username};
        votes.insert(vote);
        res.json({success: true, vote: vote});
      } else {
        res.json({success: false});
      }
    });
  } else {
    res.json({success: false})
  }
});

module.exports = {router: router};
