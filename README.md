# [gulp](https://github.com/gulpjs/gulp)-sitebuild-starter-kit
Version: **1.0.2**

## Quickstart
Download the kit or clone this repository and build on what is included in the app directory.

[Download](https://github.com/ggkovacs/gulp-sitebuild-starter-kit/releases/latest) and run `$ npm install -g gulp bower && npm install && bower install` in that directory to get started.

## Install

## Getting the code

[Download](https://github.com/ggkovacs/gulp-sitebuild-starter-kit/releases/latest) and extract to where you want to work.

## Before work

### [Node.js](https://nodejs.org)
Open a terminal and type `node --version`.
Node should respond with a version at or above 0.10.x.
If you require Node, go to [nodejs.org](https://nodejs.org) and click on the install button.

### [Gulp](http://gulpjs.com)

```sh
$ npm install -g gulp
```

### [Bower](http://bower.io)

```sh
$ npm install -g bower
```

### Local dependencies
#### npm packages

```sh
$ npm install
```

#### bower packages

```sh
$ bower install
```

## Commands

### Watch for changes and automatically refresh across devices

```sh
$ gulp serve
```

### Compile/build & optimize

```sh
$ gulp
```

### Compile/build & optimize & generate zip

```sh
$ gulp zip
```

### PageSpeed Insights (optional)

```sh
$ gulp psi
```

## Packages

### Main npm packages
- apache-server-configs
- browser-sync
- gulp
- gulp-autoprefixer
- gulp-csso
- gulp-imagemin
- gulp-jscs
- gulp-jshint
- gulp-minify-html
- gulp-rev
- gulp-rev-replace
- gulp-sane-watch
- gulp-sass
- gulp-size
- gulp-sourcemaps
- gulp-swig
- gulp-uglify
- gulp-uncss
- gulp-zip
- gulp.spritesmith (soon)
- jshint-stylish

### Optional npm packages
- require-dir (optional)
- psi (optional)
- gulp-ng-annotate (optional)

### Bower packages
- jQuery

## Browser Support
At present, we officially aim to support the following browsers:

- ie >= 9
- ff >= 30
- chrome >= 34
- safari >= 7
- opera >= 23

This is not to say that kit cannot be used in browsers older than those reflected, but merely that our focus will be on ensuring our layouts work great in the above.

## Inspiration

Gulp Sitebuild Starter Kit is inspired by [HTML5 Boilerplate](https://html5boilerplate.com/), Yeoman's [generator-gulp-webapp](https://github.com/yeoman/generator-gulp-webapp) and [Web Starter Kit](https://github.com/google/web-starter-kit).

## License
MIT (c) 2015 Gergely Kovács (gg.kovacs@gmail.com)
