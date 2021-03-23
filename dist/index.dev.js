"use strict";

var http = require('http');

var bot = require('./telegram');

var hostname = '127.0.0.1';
var port = 1111;
var server = http.createServer();
server.listen(port, hostname, function () {
  console.log("Server running at http://".concat(hostname, ":").concat(port, "/"));
});