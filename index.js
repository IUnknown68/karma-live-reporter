const path = require('path');
const express = require('express');
const createServer = require('http').createServer;
const listen = require('socket.io').listen;

const consts = require('./src/app-constants');

const WWW_ROOT = path.join(__dirname, 'build', 'www');
const INDEX_HTML = path.join(WWW_ROOT, 'index.html');
const PORT = 8255;

const LIVE_REPORTER_DATA_PROP = '_karmaLiveReporterData';

const app = express();
const server = createServer(app);
const io = listen(server);

const browserProps = [
  'id', 'name', 'fullName', 'state'
];

const extendedBrowserProps = [
  'log', 'errors', 'results'
];

const lastResultProps = [
  'success', 'failed', 'skipped',
  'total', 'totalTime', 'netTime',
  'error', 'disconnected'
];

var _browsers = null;

function mapProps(src, props, target) {
  target = target || {};
  props.forEach(function(name) {
    target[name] = src[name];
  });
  return target;
}

function mapLastResult(lastResult) {
  return mapProps(lastResult,lastResultProps);
}

function mapBrowser(browser, mapExtendedProps) {
  var props = {
    lastResult: mapLastResult(browser.lastResult)
  };
  if (mapExtendedProps) {
    props = mapProps(browser[LIVE_REPORTER_DATA_PROP], extendedBrowserProps, props);
  }
  return mapProps(browser, browserProps, props);
}

function mapAllBrowsers() {
  if (!_browsers) {
    return [];
  }
  return _browsers.map(function(browser) {
    return mapBrowser(browser, true);
  });
}

function updateBrowser(browser, reset) {
  if ('undefined' === typeof browser[LIVE_REPORTER_DATA_PROP] || reset) {
    browser[LIVE_REPORTER_DATA_PROP] = {
      log: [],
      errors: [],
      results: []
    };
  }
}

// index.html
app.get('/', function(req, res) {
  res.sendFile(INDEX_HTML);
});

// static files
app.use(express.static(WWW_ROOT));

// send initial data to a new connection
io.on('connection', function(socket) {
  socket.emit(consts.BROWSERS_CHANGE, mapAllBrowsers());
});

// listen
server.listen(PORT);

// karma-plugin
const LiveReporter = function(baseReporterDecorator, config, emitter, logger, helper, formatError) {
  baseReporterDecorator(this);
  //console.log(config);

  this.onRunStart = function() {
    io.emit(consts.RUN_START);
  }

  this.onRunComplete = function() {
    io.emit(consts.RUN_COMPLETE);
  }

  this.onBrowsersChange = function(browsers) {
    _browsers = browsers;
    _browsers.forEach(function(browser) {
      updateBrowser(browser);
    });
    io.emit(consts.BROWSERS_CHANGE, mapAllBrowsers());
  }

  this.onBrowserStart = function(browser) {
    updateBrowser(browser, true);
    io.emit(consts.BROWSER_START, mapBrowser(browser, false));
  }

  this.onBrowserLog = function(browser, log, type) {
    browser[LIVE_REPORTER_DATA_PROP].log.push({log: log, type: type});
    io.emit(consts.BROWSER_LOG, mapBrowser(browser, false), log, type);
  }

  this.onBrowserError = function(browser, error) {
    browser[LIVE_REPORTER_DATA_PROP].errors.push(error);
    io.emit(consts.BROWSER_ERROR, mapBrowser(browser, false), error);
  }

  this.onBrowserRegister = function(browser) {
    updateBrowser(browser);
    io.emit(consts.BROWSER_REGISTER, mapBrowser(browser, true));
  }

  this.onBrowserComplete = function(browser) {
    io.emit(consts.BROWSER_COMPLETE, mapBrowser(browser, false));
  }

  this.specSuccess = this.specSkipped = this.specFailure = function(browser, result) {
    browser[LIVE_REPORTER_DATA_PROP].results.push(result);
    io.emit(consts.SPEC_COMPLETED, mapBrowser(browser, false), result);
  }
};

LiveReporter.$inject = ['baseReporterDecorator', 'config', 'emitter', 'logger', 'helper', 'formatError'];

module.exports = {
  'reporter:live': ['type', LiveReporter]
}
