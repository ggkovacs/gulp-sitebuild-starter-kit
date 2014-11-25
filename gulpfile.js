/* jshint node: true */
'use strict';

var gulp = require('gulp');
var del = require('del');
var path = require('path');
var browserSync = require('browser-sync');

// load plugins
var $ = require('gulp-load-plugins')();

/**
 * Styles
 */
gulp.task('styles', function () {
    return gulp.src('app/scss/main.scss')
        .pipe($.sass({
            errLogToConsole: true
        }))
        .pipe($.autoprefixer('last 10 version'))
        .pipe($.px2rem())
        .pipe(gulp.dest('.tmp/css'))
        .pipe(browserSync.reload({stream:true}));
});

/**
 * Images
 */
gulp.task('images', function () {
    return gulp.src('app/img/**/*')
        .pipe($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('dist/img'));
});

/**
 * Fonts
 */
gulp.task('fonts', function () {
    return gulp.src('app/fonts/**/*.{eot,svg,ttf,woff}')
        .pipe(gulp.dest('dist/fonts'));
});

/**
 * Extras
 */
gulp.task('extras', function () {
    return gulp.src(['app/*.*', '!app/*.html'], {dot: true})
        .pipe(gulp.dest('dist'));
});

/**
 * Clean
 */
gulp.task('clean', function (cb) {
    return del(['.tmp', 'dist'], cb);
});

/**
 * Build
 */
gulp.task('build', []);

/**
 * Default
 */
gulp.task('default', ['clean'], function() {
    gulp.start('build');
});

/**
 * Clean template
 */
gulp.task('clean:template', function(cb) {
    return del(['app/*.html'], cb);
});

/**
 * Template
 */
gulp.task('template:html', ['clean:template'], function() {
    return gulp.src('app/templates/*.html')
        .pipe($.fileInclude())
        .pipe(gulp.dest('app/'))
        .pipe(browserSync.reload({stream:true}));
});

/**
 * Toc
 */
gulp.task('template:toc', ['template:html'], function() {
    var fs = require('fs');
    var path = require('path');
    var list = fs.readdirSync('app');
    var htmlList = [];

    for (var i = 0, l = list.length; i < l; i++) {
        if (path.extname(list[i]) === '.html') {
            htmlList.push(list[i]);
        }
    }

    return gulp.src('app/templates/.toc/index.html')
        .pipe($.template({
            htmlList: htmlList
        }))
        .pipe(gulp.dest('app'))
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
        server: {
            baseDir: './app'
        }
    });
});

/**
 * Watch
 */
gulp.task('watch', ['browser-sync'], function() {
    // Watch for changes
    $.saneWatch([
        'app/js/**/*.js',
        'app/img/**/*'
    ], function(filename, filepath) {
        browserSync.reload(path.join(filepath, filename));
    });

    $.saneWatch('app/scss/**/*.scss', function() {
        gulp.start('styles');
    });

    $.saneWatch('app/templates/**/*.html', function() {
        gulp.start('template');
    });
});
