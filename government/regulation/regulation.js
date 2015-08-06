var express = require('express');
var router = express.Router();
var raml = require('raml-parser');
var async = require('async');
var request = require('request');

var validateUrlForCitizenType = function(input, callback) {
  console.log(input);
  raml.loadFile(__dirname + "/citizen-types/" + input.citizenType + '.raml')
  .then( function(data) {
    callback(null, input);
    console.log(data);
  }, function(error) {
    console.log('Error parsing: ' + error);
    callback(null, null);
  });
}

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to the regulation api!' });
});

router.get('/enforce/all', function (req, res) {
  request.get('http://localhost:3000/government/citizenship/all',
    function(err,httpResponse,body) {
      var citizens = JSON.parse(body).results;
      inputs = [];
      validCitizens = [];
      console.log(citizens);
      citizens.forEach(function(citizen) {
          inputs.push({url: citizen.url, citizenType: citizen.citizenType});
      });
      async.map(inputs, validateUrlForCitizenType,
          function(err, results) {
              results.forEach(function(result) {
                      if(result) {
                        validCitizens.push(result);
                      }
                    });
          res.json({success: true, validCitizens: validCitizens});
        });
      })
});

router.post('/enforce/url', function (req, res) {
  var response;
  if(req.body.url && req.body.citizenTypes) {
    validCitizenTypes = [];
    inputs = [];
    req.body.citizenTypes.forEach(function(citizenType, i, arr) {
      inputs.push({citizenType: citizenType, url: req.body.url})
    })
    async.map(inputs, validateUrlForCitizenType,
        function(err, results) {
            results.forEach(function(result) {
                    if(result) {
                      validCitizenTypes.push(result.citizenType);
                    }
                  });
        res.json({success: true, validCitizenTypes: validCitizenTypes});
      });
}});

module.exports = {router: router};
