const http = require('http');
const bot = require('./telegram');

const hostname = '127.0.0.1';
const port = 1111;

const server = http.createServer();

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});