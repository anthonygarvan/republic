var request = require("request")
describe("Make sure government is alive", function() {
  it("returns something from citizenship root", function(done) {
      request.get("http://localhost:3000/government/citizenship/", function(err, response, body) {
            expect(!err && response.statusCode == 200).toBe(true);
            done();
      })
  });

  it("returns something from citizenship root", function(done) {
      request.post({url: "http://localhost:3000/government/citizenship/apply",
      form: {url: "http://localhost:3001", citizenTypes: ["citizen"]}},
      function(err, response, body) {
            expect(!err && response.statusCode == 200).toBe(true);
            result = JSON.parse(body);
            expect(result.validCitizenTypes[0]).toBe("citizen");
            done();
      })
  });

  it("returns empty valid citizens for invalid citizen type", function(done) {
      request.post({url: "http://localhost:3000/government/citizenship/apply",
      form: {url: "http://localhost:3001", citizenTypes: ["blech"]}},
      function(err, response, body) {
            expect(!err && response.statusCode == 200).toBe(true);
            result = JSON.parse(body);
            expect(result.validCitizenTypes.length).toBe(0);
            done();
      })
  });

  it("returns success false with invalid parameters", function(done) {
      request.post({url: "http://localhost:3000/government/citizenship/apply",
      form: {}},
      function(err, response, body) {
            expect(!err && response.statusCode == 200).toBe(true);
            result = JSON.parse(body);
            expect(result.success).toBe(false);
            done();
      })
  });

  it("returns success for adding collaborator", function(done) {
      request.post({url: "http://localhost:3000/government/citizenship/apply",
      form: {url: "http://localhost:3001", citizenTypes: ["citizen"]}},
      function(err, response, body) {
        var params = "url="+ encodeURIComponent("http://localhost:3001") + "&username=testuser";
        request.get("http://localhost:3000/government/citizenship/add-collaborator?" + params,
          function(err, response, body) {
              result = JSON.parse(body);
              expect(result.success).toBe(true);
              done();
          });
      })
  });

  it("can get a citizen by url", function(done) {
      request.post({url: "http://localhost:3000/government/citizenship/apply",
      form: {url: "http://localhost:3001", citizenTypes: ["citizen"]}},
      function(err, response, body) {
        var params = "url="+ encodeURIComponent("http://localhost:3001");
        request.get("http://localhost:3000/government/citizenship/get-citizen?" + params,
          function(err, response, body) {
              result = JSON.parse(body);
              expect(result.success).toBe(true);
              expect(result.citizen.url).toBe("http://localhost:3001");
              done();
          });
      })
  });

  it("can get all citizens", function(done) {
      request.post({url: "http://localhost:3000/government/citizenship/apply",
      form: {url: "http://localhost:3001", citizenTypes: ["citizen"]}},
      function(err, response, body) {
        request.get("http://localhost:3000/government/citizenship/all",
          function(err, response, body) {
              result = JSON.parse(body);
              expect(result.success).toBe(true);
              expect(result.citizens.length > 0).toBe(true);
              done();
          });
      })
  });
});
