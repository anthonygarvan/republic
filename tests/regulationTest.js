var request = require("request")
describe("Tests regulation API", function() {
  it("serves from root", function(done) {
      request.get("http://localhost:3000/government/regulation/", function(err, response, body) {
            expect(!err && response.statusCode == 200).toBe(true);
            done();
      })
  });

  it("returns at least one citizen for enforcing all citizens", function(done) {
      request.post({url: "http://localhost:3000/government/citizenship/apply",
      form: {url: "http://localhost:3001", citizenTypes: ["citizen"]}},
      function(err, response, body) {
        var params = "url="+ encodeURIComponent("http://localhost:3001") + "&username=testuser";
        request.get("http://localhost:3000/government/regulation/enforce/all",
          function(err, response, body) {
              result = JSON.parse(body);
              expect(result.success).toBe(true);
              expect(result.validCitizens.length > 0).toBe(true);
              done();
          });
      })
  });
});
