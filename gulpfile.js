const Gulp = require("gulp");
const config = require('./config');
const path = require('path');

require('./scripts/gulp-js');
require('./scripts/gulp-less');

const DEBUG = ('development' === process.env.NODE_ENV);

//------------------------------------------------------------------------------
// compile app
Gulp.task('compile', ['compile:js', 'compile:less']);

//------------------------------------------------------------------------------
// watch-js: compile app.js - watched version
Gulp.task('watch', ['watch:js', 'watch:less']);

// default task
Gulp.task('default', ['compile']);
