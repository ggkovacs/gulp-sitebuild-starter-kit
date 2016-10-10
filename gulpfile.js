/**
 *
 * Gulp sitebuild starter kit
 * Copyright 2016 Gergely Kovács (gg.kovacs@gmail.com)
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

const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const rimraf = require('rimraf');
const autoprefixer = require('autoprefixer');
const yargs = require('yargs');
const bs = require('browser-sync');
const panini = require('panini');

const reload = bs.reload;

const PRODUCTION = !!yargs.argv.production || !!yargs.argv.prod;

const processors = [
  autoprefixer({
    browsers: [
      'ie >= 9',
      'ff >= 30',
      'chrome >= 34',
      'safari >= 7',
      'opera >= 23',
      'ie_mob >= 10',
      'ios >= 7',
      'android >= 4.4',
      'bb >= 10'
    ]
  })
];

function clean(done) {
  rimraf(PRODUCTION ? 'build' : '.tmp', done);
}

function styles() {
  return gulp.src('src/assets/styles/main.s+(a|c)ss')
    .pipe($.if(!PRODUCTION, $.sourcemaps.init()))
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.postcss(processors))
    .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
    .pipe($.if(PRODUCTION, $.cleanCss()))
    .pipe(gulp.dest(PRODUCTION ? 'build/css' : '.tmp/css'))
    .pipe($.if(bs.active, reload({
      stream: true
    })));
}

function images() {
  return gulp.src('src/assets/images/**/*.{jpg,jpeg,png,gif}')
    .pipe($.imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('build/images'));
}

function fonts() {
  return gulp.src('src/assets/fonts/**/*.{eot,svg,ttf,woff,woff2}')
    .pipe(gulp.dest('build/fonts'));
}

function pages() {
  return gulp.src('src/pages/**/*.html')
    .pipe(panini({
      root: 'src/pages',
      layouts: 'src/layouts',
      partials: 'src/partials',
      helpers: 'src/helpers',
      data: 'src/data'
    }))
    .pipe($.if(PRODUCTION, $.htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeRedundantAttributes: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      removeOptionalTags: true
    })))
    .pipe(gulp.dest(PRODUCTION ? 'build' : '.tmp'))
    .pipe($.if(bs.active, reload({
      stream: true
    })));
}

function resetPages(done) {
  panini.refresh();
  done();
}

function copy() {
  return gulp.src([
    'node_modules/apache-server-configs/dist/.htaccess'
  ], {
    dot: true
  }).pipe(gulp.dest('build'));
}

function generateTableOfContent(files) {
  fs.writeFileSync('.tmp/__toc.html', `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Table of contents</title>
      <style>
        body { background: #efefef; font-family: sans-serif; margin: 30px; }
        h1 { color: #333; font-size: 24px; }
        a { color: #0275d8; line-height: 24px; font-size: 16px; text-decoration: none; }
        a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <h1>Table of contents</h1>
      <ul>
        ${files.map(file => `
          <li>
            <a href="${file}" target="_blank">${file}</a>
          </li>
        `).join('')}
      </ul>
    </body>
    </html>
  `);
}

function server(done) {
  const files = fs.readdirSync('src/pages').filter(file => path.extname(file) === '.html');
  const filesLen = files.length;

  let index = 'index.html';

  if (filesLen === 1) {
    index = files[0];
  } else if (filesLen > 1) {
    generateTableOfContent(files);
    index = '__toc.html';
  }

  bs.init({
    notify: false,
    logPrefix: 'GSSK',
    server: {
      baseDir: ['.tmp', 'src/assets'],
      index
    },
    port: 3000
  }, done);
}

function watch() {
  gulp
    .watch('src/pages/**/*.html')
    .on('change', gulp.series(pages));

  gulp
    .watch([
      'src/layouts/**/*',
      'src/partials/**/*'
    ])
    .on('change', gulp.series(resetPages, pages));

  gulp
    .watch('src/assets/styles/**/*.s+(a|c)ss')
    .on('change', gulp.series(resetPages, styles));

  gulp
    .watch('src/assets/images/**/*.{jpg,jpeg,png,gif}')
    .on('change', reload);
}

gulp.task('compile', gulp.series(clean, gulp.parallel(styles, images, fonts, pages, copy)));
gulp.task('watch', gulp.series(clean, gulp.parallel(styles, pages), server, watch));
