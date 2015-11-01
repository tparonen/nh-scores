'use strict';

var gulp            = require('gulp'),
    browserify      = require('browserify'),
    watchify        = require('watchify'),
    babelify        = require('babelify'),
    source          = require('vinyl-source-stream'),
    buffer          = require('vinyl-buffer'),
    sass            = require('gulp-sass'),
    watch           = require('gulp-watch'),
    autoprefixer    = require('gulp-autoprefixer'),
    uglify          = require('gulp-uglify'),
    concat          = require('gulp-concat'),
    rename          = require('gulp-rename'),
    livereload      = require('gulp-livereload'),
    gutil           = require('gulp-util'),
    sequencer       = require('run-sequence'),
    _               = require('lodash');

var paths = {
  'vendor': [
    './node_modules/foundation-sites/js/vendor/jquery.js',
    './node_modules/foundation-sites/js/foundation.min.js',
    './node_modules/foundation-sites/js/foundation/foundation.offcanvas.js',
    './node_modules/react/dist/react-with-addons.min.js',
    './node_modules/react-dom/dist/react-dom.min.js',
  ],
  'modernizr': './node_modules/foundation-sites/js/vendor/modernizr.js',
  'styles': './app/scss/**/*.scss',
  'scripts': './app/js/**/*.js',
  'index': './app/index.html'
};

var browserifyOpts = { entries: ['./app/js/main.js'], debug: true },
    opts = _.assign({}, watchify.args, browserifyOpts),
    b = watchify(browserify(opts));

b.transform(babelify.configure({
  presets: ['es2015', 'react']
}));

gulp.task('default', function() {
  return sequencer('build', 'watch');
});

gulp.task('sass', function() {
  return gulp.src(paths.styles)
    .pipe(sass({
    	includePaths: ['node_modules/foundation-sites/scss']
    }))
    .pipe(autoprefixer())
    .pipe(concat('app.css'))
    .pipe(gulp.dest('./public/css'))
    .pipe(livereload());
});

gulp.task('scripts', function() {
  return sequencer('modernizrJs', 'vendorJs', 'appJs');
});

gulp.task('appJs', function() {
  return b.bundle()
    .on('error', function(err) {
      gutil.log("Browserify error:", err);
      this.emit('end');
    })
    //.pipe(source(paths.scripts))
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(rename('app.min.js'))
    .pipe(gulp.dest('./public/js'))
    .pipe(livereload());
});

gulp.task('vendorJs', function() {
  return gulp.src(paths.vendor)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('./public/js'))
    .pipe(livereload());
});

gulp.task('modernizrJs', function() {
  return gulp.src(paths.modernizr)
    .pipe(concat('modernizr.js'))
    .pipe(uglify())
    .pipe(rename('modernizr.min.js'))
    .pipe(gulp.dest('./public/js'))
    .pipe(livereload());
});

gulp.task('index', function() {
  return gulp.src(paths.index)
    .pipe(gulp.dest('./public'))
    .pipe(livereload());
});

gulp.task('watch', function() {
  livereload.listen({
    host: '0.0.0.0'
  });
  b.on('update', function() { return sequencer('appJs'); });
  b.on('log', gutil.log);
  gulp.watch(paths.styles, ['sass']);
  gulp.watch(paths.index, ['index']);
});

gulp.task('build', ['test'], function() {
  return sequencer('sass', 'scripts', 'index');
});

gulp.task('test', function() {

});
