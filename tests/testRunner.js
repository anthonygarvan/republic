var server = require('../server.js');
var spawn = require('child_process').spawn;

server.start({port: 3000}, function () {
  console.log('Test server started...');
  var jasmineNode = spawn('node', ['node_modules/jasmine/bin/jasmine.js']);
  function logToConsole(data) {
      console.log(String(data));
  }
  jasmineNode.stdout.on('data', logToConsole);
  jasmineNode.stderr.on('data', logToConsole);

  jasmineNode.on('exit', function(exitCode) {
      console.log("closing server...");
      server.close();
  });
});
