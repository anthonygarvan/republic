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
candidates = db.collection("candidates");
votes = db.collection("votes")
representatives.ensureIndex({"Title": 1}, {"unique": true});
candidates.ensureIndex({"username": 1}, {"unique": true});

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
  if(req.query.title && req.query.voterUsername && req.query.candidateUsername) {
    representatives.find({}).toArray(function(err, reps) {
      var titles = [];
      reps.forEach(function(rep) {
        titles.push(rep.title);
      });
      if(titles.indexOf(req.query.title) >= 0) {
        var vote = {title: req.query.title,
                    voterUsername: req.query.voterUsername,
                    candidateUsername: req.query.candidateUsername};
        votes.update({voterUsername: req.query.candidateUsername, title: req.query.title},
          vote, {upsert: true});
        res.json({success: true, vote: vote});
      } else {
        res.json({success: false});
      }
    });
  } else {
    res.json({success: false})
  }
});

router.get('/run-for-office', function (req, res) {
  if(req.query.title && req.query.username) {
    candidates.update({username: req.query.username},
      {username: req.query.username, title: req.query.title},
      {upsert: true});
      res.json({success: true})
  } else {
    res.json({success: false})
  }
});

module.exports = {router: router};
