var pckg = require('./package.json');
var path = require('path');
var cfg = pckg.config;

var config = module.exports = {
  ROOT: __dirname
};

function mkPath() {
  var args = Array.prototype.slice.call(arguments, 0);
  var p = args.map(function(name) {
    return cfg[name];
  });
  p.unshift(__dirname);
  config[args.join('_')] = path.join.apply(null, p);
}

// src
mkPath('SRC');
// src/client
mkPath('SRC', 'CLIENT');
// src/server
mkPath('SRC', 'SERVER');
// src/server/app.js
mkPath('SRC', 'SERVER', 'APP');
// src/common
mkPath('SRC', 'COMMON');
// src/client/app.js/.less
mkPath('SRC', 'CLIENT', 'APP');

// build
mkPath('BUILD');
// build/www
mkPath('BUILD', 'WWW');
// build/www/js/app.js
mkPath('BUILD', 'WWW', 'JS', 'APP');
// build/www/css
mkPath('BUILD', 'WWW', 'CSS');
// build/www/css/app.css
mkPath('BUILD', 'WWW', 'CSS', 'APP');
// build/app.js
mkPath('BUILD', 'APP');

config.PORT = '8111';