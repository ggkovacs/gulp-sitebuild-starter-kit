# [gulp](https://github.com/gulpjs/gulp)-sitebuild-starter-kit [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> Sitebuild starter kit based on Gulp 4

Version: **4.0.2**

## Quickstart
Download the kit or clone this repository and build on what is included in the `src` directory.

[Download](https://github.com/ggkovacs/gulp-sitebuild-starter-kit/releases/latest) and run the follwing code in that directory to get started.

```sh
$ npm i -g gulp-cli && npm i
```

or

```sh
$ yarn global add gulp-cli && yarn
```

## Features

Please see our [gulpfile](gulpfile.babel.js) for up to date information on what we support.

* CSS [Autoprefixing](https://github.com/postcss/autoprefixer)
* Built-in preview server with [BrowserSync](https://www.browsersync.io/)
* Automatically compile [Sass](http://sass-lang.com/) with [libsass](http://libsass.org)
* Map compiled CSS to source stylesheets with [source maps](https://www.npmjs.com/package/gulp-sourcemaps)
* Awesome [image optimization](https://www.npmjs.com/package/gulp-imagemin)
* Automatically generates html files from [Panini](https://github.com/zurb/panini) templates
* Automatically generates table of contents from pages (if there is more than one page)

*For more information on what this generator can do for you, take a look at the [gulp plugins](package.json) used in our `package.json`.*

## libsass

Keep in mind that libsass is feature-wise not fully compatible with Ruby Sass. Check out [this](http://sass-compatibility.github.io) curated list of incompatibilities to find out which features are missing.

If your favorite feature is missing and you really need Ruby Sass, you can always switch to [gulp-ruby-sass](https://github.com/sindresorhus/gulp-ruby-sass) and update the `styles` function in gulpfile accordingly.

## Getting Started

- Install dependencies: `npm i -g gulp-cli && npm i` or `yarn global add gulp-cli && yarn`
- Run `npm start` or `yarn start` to preview and watch for changes
- Run `npm run build` or `yarn build` to build and optimize your sitebuild

## Directory structure
    .
    └── src                    # Source folder
        ├── assets             # Assets folder containing fonts, images, styles, svgs etc.
        │   ├── favicons       # Favicons folder containing icons (.png, .ico, .svg etc.).
        │   ├── fonts          # Fonts folder containing fonts (.eot, .svg, .ttf, .woff, or .woff2).
        │   ├── images         # Images folder containing images (.jpg, .jpeg, .png, or .gif).
        │   ├── scripts        # Scripts folder containing JavaScript files (.js).
        │   └── styles         # Styles folder containing stylesheets (.scss, or .sass).
        ├── data               # Data folder containing external data, which will be passed in to every page (.json, or .yml).
        ├── helpers            # Helpers folder containing Handlebars helpers (.js).
        ├── layouts            # Layouts to a folder containing layouts (.html, .hbs, or .handlebars).
        ├── pages              # Pages to the root folder all pages live in.
        └── partials           # Partials to a folder containing HTML partials.

## Browser Support (.browserslistrc)

At present, we officially aim to support the following browsers:

- \> 5%
- last 2 versions
- not ie <= 10

This is not to say that kit cannot be used in browsers older than those reflected, but merely that our focus will be on ensuring our layouts work great in the above.

## Inspiration

Gulp Sitebuild Starter Kit is inspired by [HTML5 Boilerplate](https://html5boilerplate.com/), Yeoman's [generator-gulp-webapp](https://github.com/yeoman/generator-gulp-webapp) and [Web Starter Kit](https://github.com/google/web-starter-kit).

## License
MIT © 2019 Gergely Kovács (gg.kovacs@gmail.com)

[daviddm-image]: https://david-dm.org/ggkovacs/gulp-sitebuild-starter-kit/dev-status.svg
[daviddm-url]: https://david-dm.org/ggkovacs/gulp-sitebuild-starter-kit#info=devDependencies
[travis-image]: https://travis-ci.org/ggkovacs/gulp-sitebuild-starter-kit.svg?branch=master
[travis-url]: https://travis-ci.org/ggkovacs/gulp-sitebuild-starter-kit
