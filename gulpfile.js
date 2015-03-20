/**
 *
 * Gulp sitebuild starter kit
 * Copyright 2015 Gergely Kovács (gg.kovacs@gmail.com)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');
var del = require('del');
var path = require('path');
var browserSync = require('browser-sync');
var lazypipe = require('lazypipe');
var reload = browserSync.reload;

// Load plugins
var $ = require('gulp-load-plugins')();

// Autoprefixer browser
var AUTOPREFIXER_BROWSERS = [
    'ie >= 9',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23'
];

// JSHint
gulp.task('jshint', function() {
    return gulp.src('app/scripts/**/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.jshint.reporter('fail'));
});

// JSCS
gulp.task('jscs', function() {
    return gulp.src('app/scripts/**/*.js')
        .pipe($.jscs('.jscsrc'));
});

// Test javascript (jshint, jscs)
gulp.task('test:js', ['jshint', 'jscs']);

// Styles
gulp.task('styles', function() {
    return gulp.src('app/styles/main.scss')
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            outputStyle: 'nested',
            precision: 10,
            onError: console.error.bind(console, 'Sass error:')
        }))
        .pipe($.autoprefixer({
            browsers: AUTOPREFIXER_BROWSERS
        }))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest('.tmp/css'))
        .pipe(reload({
            stream: true
        }))
        .pipe($.size({
            title: 'styles'
        }));
});

// Images
gulp.task('images', function() {
    return gulp.src('app/images/**/*')
        .pipe($.imagemin({
            progressive: true,
            interlaced: true,
            // don't remove IDs from SVGs, they are often used
            // as hooks for embedding and styling
            svgoPlugins: [{
                cleanupIDs: false
            }]
        }))
        .pipe(gulp.dest('dist/images'))
        .pipe($.size({
            title: 'images'
        }));
});

// Fonts
gulp.task('fonts', function() {
    return gulp.src('app/fonts/**/*.{eot,svg,ttf,woff,woff2}')
        .pipe(gulp.dest('dist/fonts'))
        .pipe($.size({
            title: 'fonts'
        }));
});

// Extras
gulp.task('extras', function() {
    return gulp.src([
        'app/*.*',
        '!app/*.html',
        'node_modules/apache-server-configs/dist/.htaccess'
    ], {
        dot: true
    })
        .pipe(gulp.dest('dist'))
        .pipe($.size({
            title: 'extras'
        }));
});

// Clean
gulp.task('clean', function(cb) {
    del(['.tmp', 'dist'], cb);
});

// Html
gulp.task('html', ['template', 'styles'], function() {
    var assets = $.useref.assets({
        searchPath:  ['.tmp', 'app', '.']
    });
    var jsCompile = lazypipe()
        // npm install --save-dev gulp-ng-annotate
        //.pipe($.ngAnnotate)
        .pipe($.uglify);

    return gulp.src('.tmp/views/*.html')
        .pipe(assets)
        // Concatenate and minify JavaScript
        .pipe($.if('*.js', jsCompile()))
        // Remove any unused CSS
        .pipe($.if('*.css', $.uncss({
            html: ['.tmp/views/*.html'],
            // CSS Selectors for UnCSS to ignore
            ignore: []
        })))
        .pipe($.if('*.css', $.csso()))
        .pipe($.rev())
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe($.revReplace())
        .pipe($.if('*.html', $.minifyHtml({
            conditionals: true,
            loose: true
        })))
        .pipe(gulp.dest('dist'))
        .pipe($.size({
            title: 'html'
        }));
});

// Build
gulp.task('build', ['fonts', 'images', 'extras', 'html']);

// Default
gulp.task('default', ['test:js'], function(cb) {
    runSequence('clean', 'build', cb);
});

// Zip
gulp.task('zip', ['default'], function() {
    var date = new Date();
    var datetime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    return gulp.src('dist/**/*.*')
        .pipe($.zip('dist_' + datetime + '.zip'))
        .pipe(gulp.dest('.'))
        .pipe($.size({
            title: 'zip'
        }));
});

// Clean templates
gulp.task('clean:templates', function(cb) {
    del(['.tmp/views/*.html'], cb);
});

// Template views
gulp.task('template:views', ['clean:templates'], function() {
    return gulp.src('app/views/*.html')
        .pipe($.swig({
            defaults: {
                cache: false
            }
        }))
        .pipe(gulp.dest('.tmp/views'))
        .pipe(reload({
            stream: true
        }))
        .pipe($.size({
            title: 'template:views'
        }));
});

// Table of contents
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
        .pipe(reload({
            stream: true
        }))
        .pipe($.size({
            title: 'template:toc'
        }));
});

// Template
gulp.task('template', ['template:toc']);

// Browser sync
gulp.task('browser-sync', ['template'], function() {
    browserSync({
        notify: false,
        port: 9000,
        server: {
            baseDir: ['.tmp', 'app', '.tmp/views'],
            routes: {
                '/bower_components': 'bower_components'
            }
        }
    });
});

// PageSpeed Insights
// npm install --save-dev psi
gulp.task('psi', function(cb) {
    // Update the below URL to the public URL of your site
    require('psi').output('example.com', {
        strategy: 'mobile',
        // By default we use the PageSpeed Insights free (no API key) tier.
        // Use a Google Developer API key if you have one: http://goo.gl/RkN0vE
        // key: 'YOUR_API_KEY'
    }, cb);
});

// Serve
gulp.task('serve', ['browser-sync'], function() {
    $.saneWatch([
        'app/scripts/**/*.js',
        'app/images/**/*'
    ], function(filename, filepath) {
        reload(path.join(filepath, filename));
    });

    $.saneWatch('app/styles/**/*.scss', function() {
        gulp.start('styles');
    });

    $.saneWatch('app/views/**/*.html', function() {
        gulp.start('template');
    });
});

// npm install --save-dev require-dir
// Load custom tasks from the `tasks` directory
// try {
//     require('require-dir')('tasks');
// } catch (err) {
//     console.error(err);
// }
