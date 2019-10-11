const gulp = require('gulp');
const pipeline = require('readable-stream').pipeline;
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const uglifycss = require('gulp-uglifycss');
const htmlmin = require('gulp-htmlmin');
const sass = require('gulp-sass');
const jshint = require('gulp-jshint');
const browserSync = require('browser-sync').create();
const gls = require('gulp-live-server');

function watch_files() {
    gulp.watch("./public/js/**/*", gulp.series(js_compress));
    gulp.watch("./public/css/**/*", gulp.series(css_compress));
    gulp.watch("./public/html/**/*", gulp.series(html_compress));
    gulp.watch("./public/scss/**/*", gulp.series(scss_compress));

    // gulp.watch("./public/js/**/*", gulp.series(js_hint));
    gulp.watch("./**/**/**", gulp.series(browserSyncReload));
}

function hello(done) { 
    console.log("hello");
    done();
}

// BrowserSync
function browser_sync(done) {
    browserSync.init({
        server: {
            baseDir: "./", 
            index: "index.html" 
        },
        port: process.env.PORT || 8081, 
        // ui: false,
        // open: false
    });
    done();
}

// BrowserSync Reload
function browserSyncReload(done) {
  browserSync.reload();
  done();
}

function js_hint() {
    return pipeline(
        gulp.src('./public/**/*.js'),
        // from https://jshint.com/docs/options
        jshint({ 
            'browser' : true,
             'asi' : true,
             'esversion':6,
             'globalstrict': true
        }),
        jshint.reporter('default')
    );
}


function js_compress() {
    return pipeline(
        gulp.src('./public/js/**/*.js'),
        babel({
            presets: ['@babel/env']
        }),
        uglify(),
        gulp.dest('./public/min/js')
    );
}

function css_compress() {
    return pipeline(
        gulp.src('./public/css/**/*.css'),
        uglifycss({
            "maxLineLen": 500,
            "uglyComments": true
        }),
        gulp.dest('./public/min/css')
    );
}

function html_compress() {
    return pipeline(
        gulp.src('./public/html/**/*.html'),
        htmlmin({ collapseWhitespace: true }),
        gulp.dest('./public/min/html')
    );
}

function scss_compress() {
    return pipeline(
        gulp.src('./public/scss/**/*.scss'),
        sass({outputStyle: 'compressed'}).on('error', sass.logError),
        gulp.dest('./public/min/css')
    );
}

function serve(done){
    var server = gls.static(['/', 'public', 'bower_components'], process.env.PORT || 80);
    server.start();
}


// gulp.task('browserSync', browserSync);
gulp.task('js_compress', js_compress);
gulp.task('hello', hello);
gulp.task('serve', serve);
gulp.task('default', gulp.parallel(js_compress));
gulp.task('watch', gulp.parallel(watch_files, browser_sync));

//gulp.task('default', ['browser-sync', 'watch']);