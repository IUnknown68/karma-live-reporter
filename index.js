const path = require('path');
const express = require('express');
const createServer = require('http').createServer;
const listen = require('socket.io').listen;

const WWW_ROOT = path.join(__dirname, 'build', 'www');
const INDEX_HTML = path.join(WWW_ROOT, 'index.html');
const PORT = 8255;

const app = express();
const server = createServer(app);
const io = listen(server);

const _browsers = new Map();

function assignIf(target, src, names) {
  names.forEach(function(name) {
    target[name] = ('undefined' === src[name])
      ? target[name]
      : src[name];
  });
}

function Browser(data) {
  (data && this.update(data));
}

Browser.prototype = {
  update: function(data) {
    assignIf(this, data, ['id', 'name', 'fullName', 'state', 'lastResult']);
  }
};

function updateBrowser(browserData) {
  var found = _browsers.get(browserData.id);
  if (!found) {
    found = new Browser();
    _browsers.set(browserData.id, found);
  }
  found.update(browserData);
  return found;
}

// index.html
app.get('/', function(req, res) {
  res.sendFile(INDEX_HTML);
});

// static files
app.use(express.static(WWW_ROOT));

// send initial data to a new connection
io.on('connection', function(socket) {
  const state = {
    browsers: []
  };
  _browsers.forEach(function(browser) {
    state.browsers.push(browser);
  });
  socket.emit('CurrentState', state);
});

// listen
server.listen(PORT);

// karma-plugin
const LiveReporter = function(baseReporterDecorator, config, emitter, logger, helper, formatError) {
  baseReporterDecorator(this);

  this.onRunStart = function(browsers) {
    io.emit('RunStart', browsers);
  }

  this.onRunComplete = function() {
    io.emit('RunComplete');
  }

  this.onBrowserStart = function(browser) {
    io.emit('BrowserStart', updateBrowser(browser));
  }

  this.onBrowserError = function(browser, error) {
    io.emit('BrowserError', updateBrowser(browser), error);
  }

  this.onBrowserRegister = function(browser) {
    io.emit('BrowserRegister', updateBrowser(browser));
  }

  this.onBrowserLog = function(browser, log, type) {
    io.emit('BrowserLog', updateBrowser(browser), log, type);
  }

  this.onBrowserComplete = function(browser) {
    io.emit('BrowserComplete', updateBrowser(browser));
  }

  this.specSuccess = function(browser, result) {
    io.emit('specSuccess', updateBrowser(browser), result);
  }

  this.specSkipped = function(browser, result) {
    io.emit('specSkipped', updateBrowser(browser), result);
  }

  this.specFailure = function(browser, result) {
    io.emit('specFailure', updateBrowser(browser), result);
  }
};

LiveReporter.$inject = ['baseReporterDecorator', 'config', 'emitter', 'logger', 'helper', 'formatError'];

module.exports = {
  'reporter:live': ['type', LiveReporter]
}
