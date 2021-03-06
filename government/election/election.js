var express = require('express');
var mkdirp = require('mkdirp');
var fs = require('fs');
var Engine = require('tingodb')();
var router = express.Router();
var async = require('async');
var request = require('request');

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
        votes.update({voterUsername: req.query.voterUsername, title: req.query.title},
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

router.get('/count-votes', function (req, res) {
  votes.find({}).toArray(function(err, votes) {
    var voteCount = {}
    votes.forEach(function(vote) {
      if(!(vote.title in voteCount)) {
        voteCount[vote.title] = {}
        voteCount[vote.title][vote.candidateUsername] = 1;
      } else {
        if(!(vote.candidateUsername in voteCount[vote.title])) {
          voteCount[vote.title][vote.candidateUsername] = 1;
        } else {
          voteCount[vote.title][vote.candidateUsername] += 1;
        }
      }
    });
    res.json({success: true, voteCount: voteCount});
  });
});

router.get('/run-for-office', function (req, res) {
  if(req.query.title && req.query.username) {
    candidates.update({username: req.query.username},
      {username: req.query.username, title: req.query.title, url: req.query.url},
      {upsert: true});
      res.json({success: true})
  } else {
    res.json({success: false})
  }
});

router.get('/get-candidates', function (req, res) {
  candidates.find({}).toArray(function(err, candidates) {
    res.json({success: true, candidates: candidates});
  });
});

router.get('/clear-votes', function(req, res) {
  votes.remove();
  res.json({success: true});
});

router.get('/elect-representatives', function(req, res) {
  request.get('http://localhost:3000/government/election/count-votes',
    function(err, httpResponse, body) {
        var voteCount = JSON.parse(body).voteCount;
        representatives.find({}).toArray(function(err, allReps) {
                allReps.forEach(function(rep) {
                  if(rep.title in voteCount) {
                    rep.personnel = [];
                  }});

                  voteCountByTitle = {};
                  Object.keys(voteCount).forEach(function(title) {
                    repsForTitle = Object.keys(voteCount[title])
                    repsWithVotes = []
                    repsForTitle.forEach(function(rep) {
                      repsWithVotes.push({candidate: rep, count: voteCount[title][rep]})
                    });
                    repsWithVotes.sort(function(rep1, rep2) {return rep2.count - rep1.count;})
                    voteCountByTitle[title] = repsWithVotes;
                  });

                allReps.forEach(function(rep) {
                    if(rep.title in voteCountByTitle) {
                      voteCountByTitle[rep.title].forEach(function(candidateCounts) {
                        if(rep.personnel.length < rep.maxPersonnel) {
                          rep.personnel.push(candidateCounts.candidate);
                        }
                      });
                    }
                  });

                async.map(allReps, function(rep, callback) {
                    representatives.update({title: rep.title}, rep, function() {
                      callback();
                    });
                  }, function(err, result) {
                    representatives.find({}).toArray(function(err, reps) {
                      res.json({success: true, newRepresentatives: reps});
                    });
                  });
        });
      });
});

module.exports = {router: router};
