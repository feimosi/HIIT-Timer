// Include gulp
var gulp = require('gulp'); 

// Include Our Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var cssmin = require('gulp-cssmin');
var bump = require('gulp-bump');
var minifyHTML = require('gulp-minify-html');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var print = require('gulp-print');
var del = require('del');

// Variables
var appDir = 'app/',
	buildDir = 'build/',
	tmpDir = '.tmp/';

var src = {
        scss: appDir + 'scss/*.scss',
        js: appDir + 'js/*.js',
        html: appDir + 'index.html'
    },
    dst = {
        css: buildDir + 'css/',
        js: buildDir + 'js/',
        html: buildDir
    },
    tmp = {
    	css: tmpDir + 'css/'
    };

var vendor = {
    js: [
        appDir + '/bower_components/angular/angular.min.js'
    ],
    css: [
        appDir + '/bower_components/pure/pure-min.css'
    ]
}

// Lint JS
gulp.task('lint', function() {
    return gulp.src(src.js)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Concatenate & Minify JS
gulp.task('js', ['lint'], function() {
    return gulp.src(src.js)
        .pipe(concat('main.js'))
        .pipe(gulp.dest(dst.js))
        .pipe(rename('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(dst.js));
});

gulp.task('vendor.js', function() {
    return gulp.src(vendor.js)
        .pipe(print())
        .pipe(concat('vendor.min.js'))
        .pipe(gulp.dest(dst.js));
});

gulp.task('vendor.css', function() {
    return gulp.src(vendor.css)
        .pipe(print())
        .pipe(concat('vendor.min.css'))
        .pipe(gulp.dest(dst.css));
});

gulp.task('vendor', ['vendor.js', 'vendor.css']);

// Compile Sass
gulp.task('sass', function() {
    return gulp.src(src.scss)
        .pipe(sass())
        .pipe(gulp.dest(tmp.css));
});

// Process CSS
gulp.task('css', ['sass'], function() {
    return gulp.src(tmp.css + '*.css')
        .pipe(autoprefixer())
        .pipe(concat('main.css'))
        .pipe(gulp.dest(dst.css))
        .pipe(concat('main.min.css'))
        .pipe(cssmin())
        .pipe(gulp.dest(dst.css));
});

gulp.task('html', function() {
  var opts = {
    conditionals: true,
    spare:true
  };
 
  return gulp.src(src.html)
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest(dst.html));
});

// Bump to a new version
gulp.task('bump-minor', function () {
  return gulp.src(['./bower.json', './package.json'])
    .pipe(plugins.bump({type:'minor'}))
    .pipe(gulp.dest('./'));
});

// Bump to a new version
gulp.task('bump-patch', function () {
  return gulp.src(['./bower.json', './package.json'])
    .pipe(plugins.bump({type:'patch'}))
    .pipe(gulp.dest('./'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(src.js, ['js']);
    gulp.watch(src.scss, ['css']);
    gulp.watch(src.html, ['html']);
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

gulp.task('clean', function (cb) {
  del([
    tmpDir,
    buildDir
  ], cb);
});

// Default Task
gulp.task('default', ['js', 'css', 'html', 'watch', 'browser-sync']);
