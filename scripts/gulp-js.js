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
    name: 'client-js',
    src: config.SRC_CLIENT_APP + '.js',
    dst: config.BUILD_WWW_JS_APP + '.js',
    paths: [config.SRC_CLIENT, config.SRC_COMMON],
  }
//  {
//    name: 'server-js',
//    browserify: false,
//    src: config.SRC_SERVER_APP + '.js',
//    dst: config.BUILD_APP + '.js',
//    paths: [config.SRC_SERVER + '/**/*.js', config.SRC_COMMON + '/**/*.js'],
//  }
];


//------------------------------------------------------------------------------
const compilers = targets.map(function(target) {
  const compileTask = `compile:${target.name}`;
  const watchTask = `watch:${target.name}`;

  //============ BROWSERIFY
  var boObject = null;

  //--------------------------------------------------------------------------
  function compileJs() {
    return boObject
      .bundle()
      .on("error", function (err) {
        console.error((err && err.message) || err);
      })
     .pipe(fs.createWriteStream(target.dst));
  }

  //--------------------------------------------------------------------------
  var boObject = browserify({
    debug: DEBUG,
    paths: target.paths,
    extensions: extensions,
    transform: ['browserify-shim']
  });
  boObject = boObject.on('update', compileJs);
  boObject = boObject.on('log',function(msg) {
    console.log(`${target.name}: ${msg}`);
  });
  //boObject = boObject.transform(shim);
  boObject = boObject.require(target.src, { entry: true });

  //--------------------------------------------------------------------------
  // compile task
  Gulp.task(compileTask, compileJs);

  //--------------------------------------------------------------------------
  // watch task
  Gulp.task(watchTask, function() {
    watchify(boObject);
    return compileJs();
  });

  return {
    compileTask: compileTask,
    watchTask: watchTask
  };
});

//------------------------------------------------------------------------------
// compile task
Gulp.task('compile:js', compilers.map(function(compiler) {return compiler.compileTask;}));

//------------------------------------------------------------------------------
// watch task
Gulp.task('watch:js', compilers.map(function(compiler) {return compiler.watchTask;}));
