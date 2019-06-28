/**
 *
 * Gulp sitebuild starter kit
 * Copyright 2019 Gergely Kovács (gg.kovacs@gmail.com)
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

const fs = require('fs');
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const rimraf = require('rimraf');
const autoprefixer = require('autoprefixer');
const bs = require('browser-sync');
const panini = require('panini');

const { reload } = bs;

const PRODUCTION = ['production'].includes(process.env.NODE_ENV);

const processors = [
  autoprefixer()
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

function html() {
  return gulp.src('.tmp/*.html')
    .pipe($.useref({
      searchPath: [
        '.tmp',
        'src/assets',
        '.'
      ]
    }))
    .pipe($.if(/\.js$/, $.uglify({
      compress: {
        drop_console: true
      }
    })))
    .pipe($.if(/\.css$/, $.cleanCss()))
    .pipe($.if('*.js', $.rev()))
    .pipe($.if('*.css', $.rev()))
    .pipe($.revReplace())
    .pipe($.if(/\.html$/, $.htmlmin({
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: {
        compress: {
          drop_console: true
        }
      },
      processConditionalComments: true,
      removeComments: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true
    })))
    .pipe(gulp.dest('build'));
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
    .pipe(gulp.dest('.tmp'))
    .pipe($.if(bs.active, reload({
      stream: true
    })));
}

function resetPages(done) {
  panini.refresh();
  done();
}

function copy() {
  const src = fs.readFileSync('./.copyrc', {
    encoding: 'utf8',
  })
  .split('\n')
  .filter((path) => path && path !== '');

  return gulp.src(src, {
    dot: true
  }).pipe(gulp.dest('build'));
}

function server(done) {
  bs.init({
    notify: false,
    logPrefix: 'GSSK',
    server: {
      baseDir: ['.tmp', 'src/assets', '.'],
      index: [
        'index.html'
      ]
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

  gulp
    .watch('src/assets/scripts/**/*.js')
    .on('change', reload);
}

gulp.task('compile', gulp.series(clean, gulp.parallel(styles, pages, fonts), gulp.parallel(html, images, copy)));
gulp.task('watch', gulp.series(clean, gulp.parallel(styles, pages), server, watch));
