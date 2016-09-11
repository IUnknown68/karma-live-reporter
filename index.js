const fs = require('fs');
const path = require('path');
const express = require('express');
const createServer = require('http').createServer;
const listen = require('socket.io').listen;

const MSG = require('./src/messages');

const OWN_WWW_ROOT = path.join(__dirname, 'build', 'www');
const DEFAULT_CONFIG = {
  port: 0,
  wwwRoot: false
};

const LIVE_REPORTER_DATA_PROP = '_karmaLiveReporterData';

const app = express();
const server = createServer(app);
const io = listen(server);

const configProps = [
  'port', 'protocol', 'hostname', 'browsers', 'captureTimeout', 'urlRoot',
  'browserDisconnectTimeout', 'browserDisconnectTolerance', 'browserNoActivityTimeout'
];

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

/**
 * Checks if a file is accessible. Returns the filename if so.
 * @param  {String} fileName The file to check.
 * @return {Mixed}           The `fileName`, iIf the file exists. False if not.
 */
function fileExists(fileName) {
  try {
    fs.accessSync(fileName);
    return fileName;
  }
  catch(e) {
    console.log(e);
  }
  return false;
}

/**
 * Assigns the properties specified in `props` from `src` to `target` (filtered
 * assignment).
 * @param  {Object} src    Object containing the properties to copy.
 * @param  {Array}  props  Array with propertnames.
 * @param  {Object} target Optional, target to assign properties to. Defaults to
 *                         a new object, if not given.
 * @return {Object}        `target`
 */
function mapProps(src, props, target) {
  target = target || {};
  props.forEach(function(name) {
    target[name] = src[name];
  });
  return target;
}

function mapConfig(config) {
  return mapProps(config, configProps);
}

/**
 * Maps the properties of the `lastResult`-member of a `Browser` for sending.
 * @param  {Object} lastResult Array with properties.
 * @return {Object}            Filtered `lastResult`.
 */
function mapLastResult(lastResult) {
  return mapProps(lastResult, lastResultProps);
}

/**
 * Maps the properties of a `Browser` for sending.
 * @param  {Object}  browser          A karma-`Browser`.
 * @param  {Boolean} mapExtendedProps If true, the `extendedBrowserProps` are included.
 * @return {Object}                   Filtered `Browser`.
 */
function mapBrowser(browser, mapExtendedProps) {
  var props = {
    lastResult: mapLastResult(browser.lastResult)
  };
  if (mapExtendedProps) {
    props = mapProps(browser[LIVE_REPORTER_DATA_PROP], extendedBrowserProps, props);
  }
  return mapProps(browser, browserProps, props);
}

/**
 * Maps all current browsers.
 * @return {Array} Array with `Browser`s.
 */
function mapAllBrowsers() {
  if (!_browsers) {
    return [];
  }
  return _browsers.map(function(browser) {
    return mapBrowser(browser, true);
  });
}

/**
 * Assert that the `LIVE_REPORTER_DATA_PROP` exists in `browser`. Create it, if
 * not, or if `force` forces it.
 * @param  {Object}  browser A karma-`Browser`.
 * @param  {Boolean} force   If true, overwrite existing property with a new one.
 */
function setReporterDataProperty(browser, force) {
  if ('undefined' === typeof browser[LIVE_REPORTER_DATA_PROP] || force) {
    browser[LIVE_REPORTER_DATA_PROP] = {
      log: [],
      errors: [],
      results: []
    };
  }
}

// karma-plugin
const LiveReporter = function(baseReporterDecorator, config, emitter, logger, helper, formatError) {
  baseReporterDecorator(this);

  // prepare configuration
  DEFAULT_CONFIG.port = (parseInt(config.port) - 1) || 0;
  if (DEFAULT_CONFIG.port < 1) {
    DEFAULT_CONFIG.port = 8255;
  }

  const myConfig = Object.assign({}, DEFAULT_CONFIG, config.liveReporter || {});
  myConfig.karmaPort = config.port;

  // index.html
  var indexHtml = (myConfig.wwwRoot)
    ? path.join(myConfig.wwwRoot, 'index.html')
    : false;

  indexHtml = (indexHtml && fileExists(indexHtml))
    || path.join(OWN_WWW_ROOT, 'index.html');
  app.get('/', function(req, res) {
    res.sendFile(indexHtml);
  });

  // config for client
  console.log(config);
  const clientConfig = Object.assign({}, mapConfig(config));

  // static files
  if (myConfig.wwwRoot) {
    app.use(express.static(myConfig.wwwRoot));
  }
  app.use(express.static(OWN_WWW_ROOT));

  // send initial data to a new connection
  io.on('connection', function(socket) {
    socket.emit(MSG.CONFIG, clientConfig);
    socket.emit(MSG.BROWSERS_CHANGE, mapAllBrowsers());
  });

  // reporter callbacks
  this.onRunStart = function() {
    io.emit(MSG.RUN_START);
  }

  this.onRunComplete = function() {
    io.emit(MSG.RUN_COMPLETE);
  }

  this.onBrowsersChange = function(browsers) {
    _browsers = browsers;
    _browsers.forEach(function(browser) {
      setReporterDataProperty(browser);
    });
    io.emit(MSG.BROWSERS_CHANGE, mapAllBrowsers());
  }

  this.onBrowserStart = function(browser) {
    setReporterDataProperty(browser, true);
    io.emit(MSG.BROWSER_START, mapBrowser(browser, false));
  }

  this.onBrowserLog = function(browser, log, type) {
    browser[LIVE_REPORTER_DATA_PROP].log.push({log: log, type: type});
    io.emit(MSG.BROWSER_LOG, mapBrowser(browser, false), log, type);
  }

  this.onBrowserError = function(browser, error) {
    browser[LIVE_REPORTER_DATA_PROP].errors.push(error);
    io.emit(MSG.BROWSER_ERROR, mapBrowser(browser, false), error);
  }

  this.onBrowserRegister = function(browser) {
    setReporterDataProperty(browser);
    io.emit(MSG.BROWSER_REGISTER, mapBrowser(browser, true));
  }

  this.onBrowserComplete = function(browser) {
    io.emit(MSG.BROWSER_COMPLETE, mapBrowser(browser, false));
  }

  this.specSuccess = this.specSkipped = this.specFailure = function(browser, result) {
    browser[LIVE_REPORTER_DATA_PROP].results.push(result);
    io.emit(MSG.SPEC_COMPLETED, mapBrowser(browser, false), result);
  }

  // start server
  server.listen(myConfig.port);
};

LiveReporter.$inject = ['baseReporterDecorator', 'config', 'emitter', 'logger', 'helper', 'formatError'];

module.exports = {
  'reporter:live': ['type', LiveReporter]
}
