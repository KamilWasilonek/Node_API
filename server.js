const {PORT} = require('./config');
const http = require('http');
const app = require("./app");

// Port can be set as env variable
const port = PORT || 5000;

// App is a request handles
const server = http.createServer(app);

server.listen(port);