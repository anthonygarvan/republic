var request = require("request")
describe("Tests for elections", function() {
  it("returns something from election root", function(done) {
      request.get("http://localhost:3000/government/election", function(err, response, body) {
            expect(!err && response.statusCode == 200).toBe(true);
            done();
      })
  });
});
