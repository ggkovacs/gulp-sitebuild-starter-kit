/* jshint node: true */
'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');
var del = require('del');
var path = require('path');
var browserSync = require('browser-sync');

// Load plugins
var $ = require('gulp-load-plugins')();

/**
 * Autoprefixer browser
 * @type {Array}
 */
var AUTOPREFIXER_BROWSERS = [
    'ie >= 9',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23'
];

/**
 * Styles
 */
gulp.task('styles', function() {
    return gulp.src('app/styles/main.scss')
        .pipe($.sass({
            errLogToConsole: true
        }))
        .pipe($.autoprefixer({
            browsers: AUTOPREFIXER_BROWSERS
        }))
        .pipe($.px2rem())
        .pipe(gulp.dest('.tmp/css'))
        .pipe(browserSync.reload({stream:true}));
});

/**
 * Images
 */
gulp.task('images', function() {
    return gulp.src('app/images/**/*')
        .pipe($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('dist/images'));
});

/**
 * Fonts
 */
gulp.task('fonts', function() {
    return gulp.src('app/fonts/**/*.{eot,svg,ttf,woff}')
        .pipe(gulp.dest('dist/fonts'));
});

/**
 * Extras
 */
gulp.task('extras', function() {
    return gulp.src(['app/*.*', '!app/*.html'], {dot: true})
        .pipe(gulp.dest('dist'));
});

/**
 * Clean
 */
gulp.task('clean', function(cb) {
    del(['.tmp', 'dist'], cb);
});

/**
 * Html
 */
gulp.task('html', ['template', 'styles'], function() {
    var assets = $.useref.assets({searchPath: '{.tmp,app}'});

    return gulp.src('.tmp/views/*.html')
        .pipe(assets)
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.css', $.csso()))
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe(gulp.dest('dist'));
});

/**
 * Build
 */
gulp.task('build', ['fonts', 'images', 'extras', 'html']);

/**
 * Compile
 */
gulp.task('compile', function(cb) {
    runSequence('clean', 'build', cb);
});

/**
 * Zip
 */
gulp.task('zip', ['compile'], function() {
    var date = new Date();
    var datetime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    return gulp.src('dist/**/*.*')
        .pipe($.zip('dist_' + datetime + '.zip'))
        .pipe(gulp.dest('.'));
});

/**
 * Clean template
 */
gulp.task('clean:template', function(cb) {
    del(['.tmp/views/*.html'], cb);
});

/**
 * Table of contents
 */
gulp.task('template:toc', ['template:views'], function() {
    var fs = require('fs');
    var path = require('path');
    var list = fs.readdirSync('.tmp/views');
    var htmlList = [];

    for (var i = 0, l = list.length; i < l; i++) {
        if (path.extname(list[i]) === '.html') {
            htmlList.push(list[i]);
        }
    }

    return gulp.src('app/views/.toc/index.html')
        .pipe($.swig({
            defaults: {
                cache: false
            },
            data: {
                htmlList: htmlList
            }
        }))
        .pipe(gulp.dest('.tmp/views'))
        .pipe(browserSync.reload({stream:true}));
});

/**
 * Template views
 */
gulp.task('template:views', ['clean:template'], function() {
    return gulp.src('app/views/*.html')
        .pipe($.swig({
            defaults: {
                cache: false
            }
        }))
        .pipe(gulp.dest('.tmp/views'))
        .pipe(browserSync.reload({stream:true}));
});

/**
 * Template
 */
gulp.task('template', ['template:toc']);

/**
 * Browser sync
 */
gulp.task('browser-sync', ['template'], function() {
    browserSync({
        server: ['.tmp', '.tmp/views', 'app']
    });
});

/**
 * Watch
 */
gulp.task('watch', ['browser-sync'], function() {
    $.saneWatch([
        'app/scripts/**/*.js',
        'app/images/**/*'
    ], function(filename, filepath) {
        browserSync.reload(path.join(filepath, filename));
    });

    $.saneWatch('app/styles/**/*.scss', function() {
        gulp.start('styles');
    });

    $.saneWatch('app/views/**/*.html', function() {
        gulp.start('template');
    });
});
