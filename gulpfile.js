var gulp = require('gulp'),
  browserify = require('browserify'),
  watchify = require('watchify'),
  source = require('vinyl-source-stream');

var util = require('gulp-util'),
  jshint = require('gulp-jshint'),
  sass = require('gulp-sass'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  cssmin = require('gulp-cssmin'),
  bump = require('gulp-bump'),
  minifyHTML = require('gulp-minify-html'),
  autoprefixer = require('gulp-autoprefixer'),
  browserSync = require('browser-sync').create(),
  print = require('gulp-print'),
  mocha = require('gulp-mocha'),
  del = require('del');

// Constants
var APP_DIR = 'app/',
  BUILD_DIR = 'build/',
  TMP_DIR = '.tmp/';

var src = {
    scss: APP_DIR + 'scss/**/*.scss',
    js: APP_DIR + 'js/**/*.js',
    html: APP_DIR + '*.html'
  },
  dst = {
    css: BUILD_DIR + 'css/',
    js: BUILD_DIR + 'js/',
    html: BUILD_DIR
  },
  tmp = {
    css: TMP_DIR + 'css/'
  };

var vendor = {
  css: [
    APP_DIR + '/bower_components/uikit/css/uikit.min.css'
  ]
};

gulp.task('js', ['lint-js', 'uglify-js']);

gulp.task('lint-js', function() {
  return gulp.src(src.js)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('uglify-js', function() {
  return gulp.src(dst.js)
    .pipe(uglify())
    .pipe(gulp.dest(dst.js));
});

gulp.task('vendor', ['concat-vendor-css']);

gulp.task('concat-vendor-css', function() {
  return gulp.src(vendor.css)
    .pipe(print())
    .pipe(concat('vendor.min.css'))
    .pipe(gulp.dest(dst.css));
});

gulp.task('css', ['sass'], function() {
  return gulp.src(tmp.css + '*.css')
    .pipe(autoprefixer())
    .pipe(concat('main.css'))
    .pipe(gulp.dest(dst.css))
    .pipe(concat('main.min.css'))
    .pipe(cssmin())
    .pipe(gulp.dest(dst.css));
});

gulp.task('sass', function() {
  return gulp.src(src.scss)
    .pipe(sass())
    .pipe(gulp.dest(tmp.css));
});

gulp.task('html', function() {
  var opts = {
    conditionals: true,
    spare: true
  };

  return gulp.src(src.html)
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest(dst.html));
});

gulp.task('bump-minor', function() {
  return gulp.src(['./bower.json', './package.json'])
    .pipe(plugins.bump({
      type: 'minor'
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('bump-patch', function() {
  return gulp.src(['./bower.json', './package.json'])
    .pipe(plugins.bump({
      type: 'patch'
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('watch', ['watch-html', 'watch-css', 'watch-js']);

gulp.task('watch-html', function() {
  gulp.watch(src.html, ['html']);
});

gulp.task('watch-css', function() {
  gulp.watch(src.scss, ['css']);
});

gulp.task('watch-js', function() {
  var watchifyBundle = watchify(browserify(APP_DIR + 'js/app.js'));

  var updateOnChange = function() {
    return watchifyBundle
      .bundle()
      .on('error', util.log.bind(util, 'Browserify Error'))
      .pipe(source('app.js'))
      .pipe(gulp.dest('./build/js/'));
  };

  watchifyBundle
    .on('log', util.log)
    .on('update', updateOnChange);
  updateOnChange();
});

gulp.task('browser-sync', function() {
  var files = [
    dst.html + '*.html',
    dst.css + '*.css',
    dst.js + '*.js'
  ];

  browserSync.init(files, {
    server: {
      baseDir: "./build/"
    }
  });
});

gulp.task('clean', function(cb) {
  del([
    TMP_DIR,
    BUILD_DIR
  ], cb);
});

gulp.task('test', function () {
  return gulp.src('test/test.js', { read: false })
    .pipe(mocha({ reporter: 'nyan' }));
});

gulp.task('default', ['html', 'css', 'js', 'vendor', 'watch', 'browser-sync']);
