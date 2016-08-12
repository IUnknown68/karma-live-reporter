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
const constants = require('../common/app-constants');

const BrowserComplete = require('../../datalogs/onBrowserComplete.json');
const BrowserStart = require('../../datalogs/onBrowserStart.json');
const RunStart = require('../../datalogs/onRunStart.json');
const specFailure = require('../../datalogs/specFailure.json');
const specSkipped = require('../../datalogs/specSkipped.json');
const specSuccess = require('../../datalogs/specSuccess.json');

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
  setTimeout(function() {
    io.emit(constants.RUN_START);
  }, 1000);
  setTimeout(function() {
    io.emit(constants.BROWSER_START, BrowserStart);
  }, 1100);
  setTimeout(function() {
    io.emit(constants.SPEC_SUCCESS, BrowserStart.id, specSuccess);
  }, 1500);
  setTimeout(function() {
    io.emit(constants.SPEC_SKIPPED, BrowserStart.id, specSkipped);
  }, 1600);
  setTimeout(function() {
    io.emit(constants.SPEC_FAILURE, BrowserStart.id, specFailure);
  }, 1700);
  setTimeout(function() {
    io.emit(constants.BROWSER_COMPLETE, BrowserStart.id);
  }, 2000);
  setTimeout(function() {
    io.emit(constants.RUN_COMPLETE);
  }, 2100);
});

server.listen(PORT, function() {
  console.log(`+++ Server running on port ${PORT}`);
});
