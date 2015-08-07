var express = require('express');
var router = express.Router();
var async = require('async');
var request = require('request');
var fs = require('fs');

var validateObj = function(template, result) {
  console.log(template);
  Object.keys(template).forEach(function(key) {
    console.log(key + ", " + Object.keys(result));
    if(!(key in result)) {
      console.log(key + ", " + Object.keys(result));
      return false;
    }
  });
  return true;
}

var validateUrlForCitizenType = function(input, callback) {
  console.log(input);
  fs.readFile(__dirname + "/citizen-types/" + input.citizenType + '.json',
    'utf8', function (err, data) {
      if (err) {
        console.log('Could not find citizen type: ' + err);
        callback(null, null);
      } else {
        template = JSON.parse(data);
        async.map(template.endpoints, function(endpoint, callback) {
            if(endpoint.requestType == "get") {
              var url = input.url + endpoint.relativeUri;
              console.log(url);
              request.get(url,
                function(err, httpResponse, body) {
                  if(err) {callback(null, false);}
                  else {
                    var result = JSON.parse(body);
                    var isValid = validateObj(endpoint.responseTemplate, result);
                    callback(null, isValid);
                  }
                })
            }
        }, function(err, results) {
              if(err) {callback(null, null);}
              var hasInvalidEndpoints = false;
              console.log(results);
              results.forEach(function(result) {
                  if(!result) {
                    hasInvalidEndpoints = true;
                  }
              });

              if(hasInvalidEndpoints) {
                callback(null, null)
              } else {
                callback(null, input)
              }
        })
      }
  });
}

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to the regulation api!' });
});

router.get('/enforce/all', function (req, res) {
  request.get('http://localhost:3000/government/citizenship/all',
    function(err, httpResponse, body) {
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
