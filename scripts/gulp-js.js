const Gulp = require("gulp");
const fs = require("fs");
const browserify = require("browserify");
const watchify = require('watchify');
const watch = require('gulp-watch');
const config = require('../config');

const DEBUG = ('development' === process.env.NODE_ENV);
const extensions = ['.js', '.jsx'];

//------------------------------------------------------------------------------
const targets = [
  {
    name: 'js:klr',
    src: config.SRC + '/klr.js',
    dst: config.BUILD_WWW_JS_KLR + '.js',
    paths: [config.SRC],
  },
  {
    name: 'js:app',
    src: config.SRC_APP + '.js',
    dst: config.BUILD_WWW_JS_APP + '.js',
    paths: [config.SRC],
  }
];


//------------------------------------------------------------------------------
// Create compiler, one per target.
const compilers = targets.map(function(target) {
  var boObject = null;

  //----------------------------------------------------------------------------
  function compileJs() {
    return boObject
      .bundle()
      .on("error", function (err) {
        console.error((err && err.message) || err);
      })
     .pipe(fs.createWriteStream(target.dst));
  }

  //----------------------------------------------------------------------------
  function watchJs() {
    watchify(boObject);
    return compileJs();
  }

  //----------------------------------------------------------------------------
  function logMsg(msg) {
    console.log(`${target.name}: ${msg}`);
  }

  //----------------------------------------------------------------------------
  var boObject = browserify({
    debug: DEBUG,
    paths: target.paths,
    extensions: extensions,
    transform: ['babelify', 'browserify-shim']
  })
    .on('update', compileJs)
    .on('log',logMsg)
    .require(target.src, { entry: true });

  //----------------------------------------------------------------------------
  // compile task
  const compileTaskname = `compile:${target.name}`;
  Gulp.task(compileTaskname, compileJs);

  //----------------------------------------------------------------------------
  // watch task
  const watchTaskname = `watch:${target.name}`;
  Gulp.task(watchTaskname, watchJs);

  return {
    compileTask: compileTaskname,
    watchTask: watchTaskname
  };
});

//------------------------------------------------------------------------------
// compile task
Gulp.task('compile:js', compilers.map(function(compiler) {return compiler.compileTask;}));

//------------------------------------------------------------------------------
// watch task
Gulp.task('watch:js', compilers.map(function(compiler) {return compiler.watchTask;}));
