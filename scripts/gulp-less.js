const Gulp = require('gulp');
const Less = require('gulp-less');
const Postcss = require('gulp-postcss');
const Autoprefixer = require('autoprefixer-core');
const sourcemaps = require('gulp-sourcemaps');
const path = require('path');
const config = require('../config');

const DEBUG = ('development' === process.env.NODE_ENV);

//------------------------------------------------------------------------------
function compileLess(cb) {
  var srcFile = config.SRC_CLIENT_APP + '.less';
  if (!srcFile) {
    cb();
    return;
  }

  var paths = [config.SRC_CLIENT];

  // bootstrap
  paths.push(path.join(process.cwd(), 'node_modules', 'bootstrap', 'less'));

  // font awesome
  paths.push(path.join(process.cwd(), 'node_modules', 'font-awesome', 'less'));

  // app.less
  var stream = Gulp.src(srcFile)
  .on('end', function() {
    console.log('LESS Done');
    cb();
  })
  .on('error', function(err) {
    console.error('LESS error:', (err && err.message) || err);
  });

  if (DEBUG) {
    stream = stream.pipe(sourcemaps.init());
  }

  stream = stream
  .pipe(Less({
    compress: true,
    paths: paths
  })).pipe(Postcss([
    Autoprefixer()
  ]));

  if (DEBUG) {
    stream = stream.pipe(sourcemaps.write());
  }
  stream = stream.pipe(Gulp.dest(config.BUILD_WWW_CSS));

  // font awesome files
  Gulp.src(path.join(config.ROOT, 'node_modules', 'font-awesome', 'fonts','/*'))
    .pipe(Gulp.dest(path.join(config.BUILD_WWW, 'fonts')));
}

//------------------------------------------------------------------------------
Gulp.task('compile:less', compileLess);

//------------------------------------------------------------------------------
// watch-less: watch less files
Gulp.task('watch:less', ['compile:less'], function() {
  Gulp.watch(config.SRC_CLIENT + '/**/*.less', ['compile:less']);
});


module.exports = {
  compileLess: compileLess
};