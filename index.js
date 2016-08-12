const path = require('path');
const express = require('express');
const createServer = require('http').createServer;
const listen = require('socket.io').listen;

const consts = require('./src/common/app-constants');

const WWW_ROOT = path.join(__dirname, 'build', 'www');
const INDEX_HTML = path.join(WWW_ROOT, 'index.html');
const PORT = 8255;

const app = express();
const server = createServer(app);
const io = listen(server);

var _browsers = null;

function lastResultToJson(lastResult) {
  return {
    success: lastResult.success,
    failed: lastResult.failed,
    skipped: lastResult.skipped,
    total: lastResult.total,
    totalTime: lastResult.totalTime,
    netTime: lastResult.netTime,
    error: lastResult.error,
    disconnected: lastResult.disconnected
  };
}

function browserToJson(browser) {
  return {
    id: browser.id,
    name: browser.name,
    fullName: browser.fullName,
    state: browser.state,
    lastResult: lastResultToJson(browser.lastResult)
  };
}

function browsersToJson() {
  console.log(`browsersToJson`, _browsers);
  if (!_browsers) {
    return [];
  }
  return _browsers.map(function(browser) {
    return browserToJson(browser);
  });
}

// index.html
app.get('/', function(req, res) {
  res.sendFile(INDEX_HTML);
});

// static files
app.use(express.static(WWW_ROOT));

// send initial data to a new connection
io.on('connection', function(socket) {
  socket.emit(consts.BROWSERS_CHANGE, browsersToJson());
});

// listen
server.listen(PORT);

// karma-plugin
const LiveReporter = function(baseReporterDecorator, config, emitter, logger, helper, formatError) {
  baseReporterDecorator(this);

  this.onRunStart = function() {
    io.emit(consts.RUN_START);
  }

  this.onRunComplete = function() {
    io.emit(consts.RUN_COMPLETE);
  }

  this.onBrowsersChange = function(browsers) {
    console.log('onBrowsersChange', browsers);
    _browsers = (browsers)
      ? browsers
      : _browsers;
    io.emit(consts.BROWSERS_CHANGE, browsersToJson());
  }

  this.onBrowserStart = function(browser) {
    io.emit(consts.BROWSER_START, browserToJson(browser));
  }

  this.onBrowserError = function(browser, error) {
    io.emit(consts.BROWSER_ERROR, browserToJson(browser), error);
  }

  this.onBrowserRegister = function(browser) {
    io.emit(consts.BROWSER_REGISTER, browserToJson(browser));
  }

  this.onBrowserLog = function(browser, log, type) {
    io.emit(consts.BROWSER_LOG, browserToJson(browser), log, type);
  }

  this.onBrowserComplete = function(browser) {
    io.emit(consts.BROWSER_COMPLETE, browserToJson(browser));
  }

  this.specSuccess = function(browser, result) {
    io.emit(consts.SPEC_SUCCESS, browserToJson(browser), result);
  }

  this.specSkipped = function(browser, result) {
    io.emit(consts.SPEC_SKIPPED, browserToJson(browser), result);
  }

  this.specFailure = function(browser, result) {
    io.emit(consts.SPEC_FAILURE, browserToJson(browser), result);
  }
};

LiveReporter.$inject = ['baseReporterDecorator', 'config', 'emitter', 'logger', 'helper', 'formatError'];

module.exports = {
  'reporter:live': ['type', LiveReporter]
}
