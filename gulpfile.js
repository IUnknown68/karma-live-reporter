const Gulp = require("gulp");
const Nodemon = require('gulp-nodemon');
const config = require('./config');
const path = require('path');

require('./scripts/gulp-js');
require('./scripts/gulp-less');

const DEBUG = ('development' === process.env.NODE_ENV);

//------------------------------------------------------------------------------
// run static server
function runDemon() {
  Nodemon({
    script: config.SRC_SERVER_APP + '.js',
    watch: [config.SRC_SERVER, config.SRC_COMMON],
    env: {
      NODE_ENV: 'development',
      NODE_PATH: 'src',
      PORT: config.PORT,
      WWW_ROOT: config.BUILD_WWW
    }
  });
};

//------------------------------------------------------------------------------
// compile app
Gulp.task('compile', ['compile:js', 'compile:less']);

//------------------------------------------------------------------------------
// watch-js: compile app.js - watched version
Gulp.task('watch', ['watch:js', 'watch:less']);

//------------------------------------------------------------------------------
// watch-js: compile app.js - watched version
Gulp.task('devserver', ['watch'], runDemon);

//------------------------------------------------------------------------------
// default task
Gulp.task('default', ['devserver']);
