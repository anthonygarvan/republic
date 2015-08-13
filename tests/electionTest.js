var request = require("request")
var async = require('async');

describe("Tests for elections", function() {
  it("returns something from election root", function(done) {
      request.get("http://localhost:3000/government/election", function(err, response, body) {
            expect(!err && response.statusCode == 200).toBe(true);
            done();
      })
  });

  it("returns representatives", function(done) {
      request.get("http://localhost:3000/government/election/get-representatives", function(err, response, body) {
            expect(!err && response.statusCode == 200).toBe(true);
            var result = JSON.parse(body);
            expect(result.success).toBe(true);
            expect(result.representatives.length > 0).toBe(true);
            done();
      })
  });

  it("returns representatives after boostrapping", function(done) {
      request.get("http://localhost:3000/government/election/remove-representatives",
        function(err, response, body) {
          request.get("http://localhost:3000/government/election/get-representatives", function(err, response, body) {
            expect(!err && response.statusCode == 200).toBe(true);
            var result = JSON.parse(body);
            expect(result.success).toBe(true);
            expect(result.representatives.length > 0).toBe(true);
            done();
          });
      })
  });

  it("returns success false with no parameters", function(done) {
      request.get("http://localhost:3000/government/election/vote", function(err, response, body) {
            expect(!err && response.statusCode == 200).toBe(true);
            var result = JSON.parse(body);
            expect(result.success).toBe(false);
            done();
      })
  });

  it("returns success false with invalid title", function(done) {
      request.get("http://localhost:3000/government/election/vote?voterUsername=ImaVoter&candidateUsername=ImaCandidate&title=nonexistent", function(err, response, body) {
            expect(!err && response.statusCode == 200).toBe(true);
            var result = JSON.parse(body);
            expect(result.success).toBe(false);
            done();
      })
  });

  it("returns success true with username and title provided", function(done) {
      var title = encodeURIComponent("Feature Lead");
      request.get("http://localhost:3000/government/election/vote?voterUsername=ImaVoter&candidateUsername=ImaCandidate&title=" + title, function(err, response, body) {
            expect(!err && response.statusCode == 200).toBe(true);
            var result = JSON.parse(body);
            expect(result.success).toBe(true);
            done();
      })
  });

  it("returns success true when getting votes", function(done) {
      request.get("http://localhost:3000/government/election/count-votes", function(err, response, body) {
            expect(!err && response.statusCode == 200).toBe(true);
            var result = JSON.parse(body);
            expect(result.success).toBe(true);
            done();
      })
  });

  it("counts votes properly", function(done) {
      votes = [{candidateUsername: "ImaCandy1983", voterUsername: "ImaV1"},
                {candidateUsername: "ImaCandy1983", voterUsername: "ImaV1"},
                {candidateUsername: "ImaCandy1983", voterUsername: "ImaV2"}];
      async.map(votes, function(vote, callback) {
        var title = encodeURIComponent("Feature Lead");
        request.get("http://localhost:3000/government/election/vote?voterUsername=" + vote.voterUsername +
                    "&candidateUsername="+ vote.candidateUsername + "&title=" + title,
                    function(err, response, body) {callback();})
      }, function(err, results) {
        request.get("http://localhost:3000/government/election/count-votes", function(err, response, body) {
              expect(!err && response.statusCode == 200).toBe(true);
              var result = JSON.parse(body);
              expect(result.success).toBe(true);
              expect(result.voteCount["Feature Lead"]["ImaCandy1983"]).toBe(2);
              done();
        });
      });
  });

  it("returns success when running for office", function(done) {
      var title = encodeURIComponent("Feature Lead");
      request.get("http://localhost:3000/government/election/run-for-office?username=ImaCandidate&title=" + title,
            function(err, response, body) {
              expect(!err && response.statusCode == 200).toBe(true);
              var result = JSON.parse(body);
              expect(result.success).toBe(true);
              done();
    });
  });

  it("returns success false when running for office without proper params", function(done) {
      request.get("http://localhost:3000/government/election/run-for-office",
            function(err, response, body) {
              expect(!err && response.statusCode == 200).toBe(true);
              var result = JSON.parse(body);
              expect(result.success).toBe(false);
              done();
    });
  });

    it("returns success true when getting candidates", function(done) {
        request.get("http://localhost:3000/government/election/get-candidates",
              function(err, response, body) {
                expect(!err && response.statusCode == 200).toBe(true);
                var result = JSON.parse(body);
                expect(result.success).toBe(true);
                expect(result.candidates.length >= 0).toBe(true)
                done();
      });
  });
});
