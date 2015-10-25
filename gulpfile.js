var gulp            = require('gulp'),
    sass            = require('gulp-sass'),
    watch           = require('gulp-watch'),
    autoprefixer    = require('gulp-autoprefixer'),
    uglify          = require('gulp-uglify'),
    concat          = require('gulp-concat'),
    rename          = require('gulp-rename'),
    webserver       = require('gulp-webserver'),
    livereload      = require('gulp-livereload'),
    karma           = require('gulp-karma'),
    sequencer       = require('run-sequence'),
    merge           = require('merge-stream');

var paths = {
  'vendor': [
    './node_modules/foundation-sites/js/vendor/jquery.js',
    './node_modules/foundation-sites/js/foundation.js',
    './node_modules/foundation-sites/js/foundation/foundation.offcanvas.js',
    './node_modules/react/dist/react.js'
  ],
  'modernizr': './node_modules/foundation-sites/js/vendor/modernizr.js',
  'styles': './app/scss/**/*.scss',
  'scripts': './app/js/**/*.js',
  'index': './app/index.html'
};

gulp.task('default', function() {
  return sequencer('build', 'watch', 'webserver');
});

gulp.task('webserver', function() {
  var express = require('express');
  var app = express();

  app.use(require('connect-livereload')({port: 35729}));
  app.use('/', express.static(__dirname + '/public'));

  app.use('/api/', require('./rest/index'));
  app.use('/api/games/', require('./rest/games'));

  //app.use(bodyParser.json());
  //app.use(bodyParser.urlencoded({ extended: false }));
  //app.use(cookieParser());

  app.listen(8080, '0.0.0.0');
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
  return gulp.src([paths.scripts])
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(rename('app.min.js'))
    .pipe(gulp.dest('./public/js'))
    .pipe(livereload());
});

gulp.task('vendorJs', function() {
  return gulp.src(paths.vendor)
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(rename('vendor.min.js'))
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
  livereload.listen();
  gulp.watch(paths.styles, ['sass']);
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.index, ['index']);
});

gulp.task('build', ['test'], function() {
  return sequencer('sass', 'scripts', 'index');
});

gulp.task('test', function() {

});
