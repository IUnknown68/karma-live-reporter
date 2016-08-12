//==============================================================================
// Development server
// Quick'n dirty solution to run a development server for developing / debugging
// in a browser.

const path = require('path');
const express = require('express');
const createServer = require('http').createServer;
const listen = require('socket.io').listen;
const logger = require('morgan');

const config = require('../../config');

const WWW_ROOT = process.env.WWW_ROOT || path.join(__dirname, '..', 'www');
const INDEX_HTML = path.join(WWW_ROOT, 'index.html');
const PORT = process.env.PORT || 8123;

const app = express();
const server = createServer(app);
const io = listen(server);
app.use(logger('dev'));

// index.html
app.get('/', function(req, res) {
  res.sendFile(INDEX_HTML);
});

// static files
app.use(express.static(WWW_ROOT));

//const tdserver = twodotsServer(io, {rpc: rpc});

io.on('connection', function(socket) {
  console.log('connection');
});

server.listen(PORT, function() {
  console.log(`+++ Server running on port ${PORT}`);
});
