var request = require("request")
describe("Make sure server is running", function() {
  it("can serve from the root directory", function(done) {
      request.get("http://localhost:3000/", function(err, response, body) {
            expect(!err && response.statusCode == 200).toBe(true);
            done();
      })
  });
});
