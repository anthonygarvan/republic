var request = require("request")
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

  it("returns success false with no parameters", function(done) {
      request.get("http://localhost:3000/government/election/vote", function(err, response, body) {
            expect(!err && response.statusCode == 200).toBe(true);
            var result = JSON.parse(body);
            expect(result.success).toBe(false);
            done();
      })
  });

  it("returns success false with invalid title", function(done) {

      request.get("http://localhost:3000/government/election/vote?username=test_user&title=nonexistent", function(err, response, body) {
            expect(!err && response.statusCode == 200).toBe(true);
            var result = JSON.parse(body);
            expect(result.success).toBe(false);
            done();
      })
  });

  it("returns success true with username and title provided", function(done) {
      var title = encodeURIComponent("Feature Lead");
      request.get("http://localhost:3000/government/election/vote?username=test_user&title=" + title, function(err, response, body) {
            expect(!err && response.statusCode == 200).toBe(true);
            var result = JSON.parse(body);

            expect(result.success).toBe(true);
            done();
      })
  });
});
