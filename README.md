# [gulp](https://github.com/gulpjs/gulp)-sitebuild-starter-kit [![devDependency Status][daviddm-image]][daviddm-url]
> Sitebuild starter kit based on gulp.js

Version: **2.0.4**

## Quickstart
Download the kit or clone this repository and build on what is included in the app directory.

[Download](https://github.com/ggkovacs/gulp-sitebuild-starter-kit/releases/latest) and run the follwing code in that directory to get started.

```sh
$ npm install -g gulp bower && npm install
```

## Features

Please see our [gulpfile](gulpfile.babel.js) for up to date information on what we support.

* CSS Autoprefixing 
* Built-in preview server with BrowserSync
* Automatically compile Sass with [libsass](http://libsass.org)
* Automatically lint your scripts
* Map compiled CSS to source stylesheets with source maps
* Awesome image optimization
* Automatically wire-up dependencies installed with [Bower](http://bower.io)
* Automatically generates html files from [Swig](http://paularmstrong.github.io/swig/) templates
* Automatically generates table of contents from html files
* The gulpfile makes use of [ES2015 features](https://babeljs.io/docs/learn-es2015/) by using [Babel](https://babeljs.io)

*For more information on what this generator can do for you, take a look at the [gulp plugins](package.json) used in our `package.json`.*

## libsass

Keep in mind that libsass is feature-wise not fully compatible with Ruby Sass. Check out [this](http://sass-compatibility.github.io) curated list of incompatibilities to find out which features are missing.

If your favorite feature is missing and you really need Ruby Sass, you can always switch to [gulp-ruby-sass](https://github.com/sindresorhus/gulp-ruby-sass) and update the `styles` task in gulpfile accordingly.

## Getting Started

- Install dependencies: `npm install --global gulp bower`
- Run `gulp serve` to preview and watch for changes
- Run `bower install --save <package>` to install frontend dependencies
- Run `gulp` to build and optimize your sitebuild
- Run `gulp zip` to build, optimize and generate zip
- Run `gulp psi` to pagespeed insights (optional task)

## Browser Support
At present, we officially aim to support the following browsers:

- ie >= 9
- ff >= 30
- chrome >= 34
- safari >= 7
- opera >= 23
- ie_mob >= 10
- ios >= 7
- android >= 4.4
- bb >= 10

This is not to say that kit cannot be used in browsers older than those reflected, but merely that our focus will be on ensuring our layouts work great in the above.

## Inspiration

Gulp Sitebuild Starter Kit is inspired by [HTML5 Boilerplate](https://html5boilerplate.com/), Yeoman's [generator-gulp-webapp](https://github.com/yeoman/generator-gulp-webapp) and [Web Starter Kit](https://github.com/google/web-starter-kit).

## License
MIT © 2015 Gergely Kovács (gg.kovacs@gmail.com)

[daviddm-image]: https://david-dm.org/ggkovacs/gulp-sitebuild-starter-kit/dev-status.svg
[daviddm-url]: https://david-dm.org/ggkovacs/gulp-sitebuild-starter-kit#info=devDependencies
