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

/* jshint node: true */
'use strict';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import runSequence from 'run-sequence';
import del from 'del';
import browserSync from 'browser-sync';
import path from 'path';
import autoprefixer from 'autoprefixer';
import bowerFiles from 'main-bower-files';

const reload = browserSync.reload;
const $ = gulpLoadPlugins();

// Autoprefixer browser
const AUTOPREFIXER_BROWSERS = [
    'ie >= 9',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ie_mob >= 10',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10',
];

// JSHint
gulp.task('jshint', () =>
    gulp.src('app/scripts/**/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.jshint.reporter('fail'))
);

// JSCS
gulp.task('jscs', () =>
    gulp.src('app/scripts/**/*.js')
        .pipe($.jscs('.jscsrc'))
);

// Test javascript (jshint, jscs)
gulp.task('test:js', ['jshint', 'jscs']);

// Pre commit task
gulp.task('commit', ['test:js']);

// Styles
gulp.task('styles', () => {
    let processors = [
        autoprefixer({
            browsers: AUTOPREFIXER_BROWSERS,
        }),
    ];

    gulp.src('app/styles/**/*.sass')
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            indentedSyntax: true,
            outputStyle: 'nested',
            precision: 10,
        }).on('error', $.sass.logError))
        .pipe($.postcss(processors))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest('.tmp/css'))
        .pipe($.if(browserSync.active, reload({
            stream: true,
        })))
        .pipe($.size({
            title: 'styles',
        }));
});

// Images
gulp.task('images', () =>
    gulp.src('app/images/**/*')
        .pipe($.cache($.imagemin({
            progressive: true,
            interlaced: true,
        })))
        .pipe(gulp.dest('dist/images'))
        .pipe($.size({
            title: 'images',
        }))
);

// Fonts
gulp.task('fonts', () =>
    gulp.src('app/fonts/**/*.{eot,svg,ttf,woff,woff2}')
        .pipe(gulp.dest('dist/fonts'))
        .pipe($.size({
            title: 'fonts',
        }))
);

// Extras
gulp.task('extras', () =>
    gulp.src([
        'app/*.*',
        '!app/*.html',
        'node_modules/apache-server-configs/dist/.htaccess',
    ], {
        dot: true,
    })
        .pipe(gulp.dest('dist'))
        .pipe($.size({
            title: 'extras',
        }))
);

// Bower files
gulp.task('bowerfiles', () =>
    gulp.src('app/views/layouts/*.html')
        .pipe($.inject(gulp.src(bowerFiles(), {
            read: false,
        }), {
            name: 'bower',
            addRootSlash: false,
            ignorePath: [
                'app',
            ],
            empty: true,
        }))
        .pipe(gulp.dest('app/views/layouts'))
        .pipe($.size({
            title: 'bowerFiles',
        }))
);

// Clean
gulp.task('clean', () => del(['.tmp', 'dist/*', '!dist/.git'], {dot: true}));

// Html
gulp.task('html', ['template:build', 'styles'], () =>
    gulp.src('.tmp/views/*.html')
        .pipe($.usemin({
            css: [
                $.uncss({
                    html: ['.tmp/views/*.html'],
                    ignore: [/.js/], // CSS Selectors for UnCSS to ignore
                }),
                $.minifyCss(),
                $.rev(),
            ],
            js: [

                // $.ngAnnotate() // npm install --save-dev gulp-ng-annotate
                $.uglify({
                    preserveComments: 'all',
                }),
                $.rev(),
            ],
            html: [
                function() {
                    return $.minifyHtml({
                        conditionals: true,
                        loose: true,
                    });
                },
            ],
        }))
        .pipe(gulp.dest('dist'))
        .pipe($.size({
            title: 'html',
        }))
);

// Default
gulp.task('default', ['test:js'], cb => runSequence('clean', ['fonts', 'images', 'extras', 'html'], cb));

// Zip
gulp.task('zip', ['default'], () => {
    function addZero(value) {
        value = value.toString();
        return value[1] ? value : '0' + value;
    }

    function getFormattedDate() {
        let date = new Date();
        let year = date.getFullYear().toString();
        let month = addZero((date.getMonth() + 1));
        let day = addZero(date.getDate());
        let hour = addZero(date.getHours());
        let minute = addZero(date.getMinutes());

        return year + month + day  + hour + minute;
    }

    return gulp.src(['dist/**/*.*', '!dist/.git'])
        .pipe($.zip('dist-' + getFormattedDate() + '.zip'))
        .pipe(gulp.dest('.'))
        .pipe($.size({
            title: 'zip',
        }));
});

// Clean templates
gulp.task('clean:templates', () => del(['.tmp/views/*.html']));

// Template views
gulp.task('template:views', () =>
    gulp.src('app/views/*.html')
        .pipe($.swig({
            defaults: {
                cache: false,
            },
        }))
        .pipe(gulp.dest('.tmp/views'))
        .pipe($.if(browserSync.active, reload({
            stream: true,
        })))
        .pipe($.size({
            title: 'template:views',
        }))
);

// Table of contents
gulp.task('template:toc', () => {
    let fs = require('fs');
    let path = require('path');
    let list = fs.readdirSync('.tmp/views');
    let htmlList = [];

    for (let i = 0, l = list.length; i < l; i++) {
        if (path.extname(list[i]) === '.html') {
            htmlList.push(list[i]);
        }
    }

    return gulp.src('app/views/.toc/index.html')
        .pipe($.swig({
            defaults: {
                cache: false,
            },
            data: {
                htmlList: htmlList,
            },
        }))
        .pipe(gulp.dest('.tmp/views'))
        .pipe($.if(browserSync.active, reload({
            stream: true,
        })))
        .pipe($.size({
            title: 'template:toc',
        }));
});

// Template
gulp.task('template', cb =>
    runSequence('clean:templates', 'template:views', 'template:toc', cb)
);

// Template build
gulp.task('template:build', cb =>
    runSequence('clean:templates', 'bowerfiles', 'template:views', 'template:toc', cb)
);

// Browser sync
gulp.task('browser-sync', ['template:build', 'styles'], () => {
    browserSync({
        notify: false,
        port: 9000,
        logPrefix: 'GSSK',
        server: {
            baseDir: ['.tmp', 'app', '.tmp/views'],
            routes: {
                '/bower_components': 'app/bower_components',
            },
        },
    });
});

// PageSpeed Insights
// npm install --save-dev psi
gulp.task('psi', cb =>

    // Update the below URL to the public URL of your site
    require('psi').output('example.com', {
        strategy: 'mobile',

        // By default we use the PageSpeed Insights free (no API key) tier.
        // Use a Google Developer API key if you have one: http://goo.gl/RkN0vE
        // key: 'YOUR_API_KEY'
    }, cb)
);

// Serve
gulp.task('serve', ['browser-sync'], () => {
    $.saneWatch([
        'app/scripts/**/*.js',
        'app/images/**/*',
    ], (filename, filepath) => {
        reload(path.join(filepath, filename));
    });

    $.saneWatch('app/styles/**/*.sass', () => {
        gulp.start('styles');
    });

    $.saneWatch('app/views/**/*.html', () => {
        gulp.start('template');
    });

    $.saneWatch('bower.json', {
        debounce: 500,
    }, () => {
        gulp.start('bowerfiles');
    });
});

// npm install --save-dev require-dir
// Load custom tasks from the `tasks` directory
// try {
//     require('require-dir')('tasks');
// } catch (err) {
//     console.error(err);
// }
