var request = require("request")
describe("Make sure government is alive", function() {
  it("is alive", function(done) {
      request.get("http://localhost:3000/government/isalive", function(err, response, body) {
            expect(!err && response.statusCode == 200).toBe(true);
            done();
      })
  });

  it("returns something from government root", function(done) {
      request.get("http://localhost:3000/government/", function(err, response, body) {
            expect(!err && response.statusCode == 200).toBe(true);
            done();
      })
  });
});
