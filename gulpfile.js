/**
 *
 *  Audi UI
 *  Copyright 2016 Audi AG. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */

'use strict'; // eslint-disable-line strict

const _ = require('gulp-load-plugins')();
const browserSync = require('browser-sync').create();
const del = require('del');
const gulp = require('gulp');
const pkg = require('./package.json');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');


// ----------------------------------------------------------------------------
// CONFIG
// ----------------------------------------------------------------------------

const libraryName = 'audi-ui';
const libraryDest = 'dist';
const testFolder = '.temp/test/visual';

const banner = `/**
 * ${pkg.name} - ${pkg.description}
 * @version v${pkg.version}
 * @license ${pkg.license}
 * @copyright ${new Date().getFullYear()} ${pkg.author}
 * @link ${pkg.homepage}
 */\n`;

const webpackConfig = {
  output: {
    filename: `${libraryName}.min.js`,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          compact: false
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({ minimize: true }),
    new webpack.BannerPlugin(banner, { raw: true })
  ]
};

const webpackConfigTest = {
  output: {
    filename: `test.min.js`,
    libraryTarget: 'umd'
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          compact: false
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      }
    ]
  }
};

const nunjucksConfig = {
  path: ['test/visual/', 'src'],
  envOptions: {
    watch: false
  },
  manageEnv: function(environment) {
    environment.addFilter('path', function(str, baseDir) {
      // TODO switch depending on environment (test, deploy, etc.)
      const dir = {
        test: '.temp/test/visual/',
      };
      baseDir = dir[baseDir] || '';
      return `/${baseDir}${str}`;
    });

    environment.addFilter('slug', function(str) {
      return str && str.replace(/\s/g, '-', str).toLowerCase();
    });

    environment.addGlobal('testFolder', testFolder);
  }
};


// ----------------------------------------------------------------------------
// ERROR HANDLING
// ----------------------------------------------------------------------------

/**
 * Template for error logging messages.
 * @param {Object} error object.
 * @returns {string} template
 */
function errorLoggingTemplate(error) {
  return `${_.util.colors.bgRed(`${error.name} in ${error.relativePath}`)}

  ⚠️       ${error.name} ${_.util.colors.dim(`reported by`)} ${error.plugin}

  Path:   ${error.relativePath}
  Line:   ${error.line}
  Column: ${error.column}

  ${_.util.colors.red( error.formatted ? error.formatted.split('\n').join('\n  ') : '' )}`;
};


/**
 * Template for error notifications.
 * @param {Object} error object.
 * @returns {Object} notification
 */
function errorNotifyObject(error) {
  return {
    title: `Gulp`,
    subtitle: `${error.name}: ${error.plugin}`,
    message: `${error.relativePath} ${error.line}:${error.column}`,
    sound: 'Hero',
  };
}


/**
 * Error handling
 *
 * To eliminate the need of adding the error handler to each task, we overwrite
 * the `gulp.src` method and add proper error logging messages and notifications.
 */
const _gulpSrc = gulp.src;
gulp.src = function() {
  return _gulpSrc
    .apply(gulp, arguments)
    .pipe(_.plumber(function(error) {
      // Log error message in console
      _.util.log(errorLoggingTemplate(error));

      // Display notification
      _.notify.onError(errorNotifyObject(error)).apply(this, arguments);

      // Emit the end event, to properly end the task
      this.emit('end');
    }));
};


// ----------------------------------------------------------------------------
// CSS
// ----------------------------------------------------------------------------
gulp.task('css', function() {
  return gulp.src('src/index.scss')
    .pipe(_.plumber())
    .pipe(_.sass({precision: 10}))
    .pipe(_.autoprefixer({
      browsers: ['last 2 version']
    }))
    .pipe(_.header(banner))
    .pipe(_.rename({
      basename: libraryName
    }))
    .pipe(gulp.dest(libraryDest))
    .pipe(_.if ('*.css', _.csso()))
    .pipe(_.header(banner))
    .pipe(_.rename({
      suffix: '.min'
    }))
    // .pipe(_.plumber.stop())
    .pipe(gulp.dest(libraryDest))
    .pipe(_.size({
      title: _.util.colors.underline('CSS size:') + '\n',
      showFiles: true,
      showTotal: false,
      gzip: true
  }));
});


// ----------------------------------------------------------------------------
// JS
// ----------------------------------------------------------------------------
gulp.task('js', function() {
  return gulp.src('src/index.js')
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe(gulp.dest(libraryDest))
    .pipe(_.size({
      title: _.util.colors.underline('JS size:') + '\n',
      showFiles: true,
      showTotal: false,
      gzip: true
  }));
});


// ----------------------------------------------------------------------------
// SERVE & WATCH
// ----------------------------------------------------------------------------
gulp.task('serve:test', function(done) {
  browserSync.init({
    notify: false,
    server: '.',
    startPath: `${testFolder}/index.html`
  }, done);
});

gulp.task('reload', function(done) {
  browserSync.reload();
  done();
});

// FIXME CSS live injection currently not working with proxy option.
// Quick win is to perform a page reload.
gulp.task('watch:css', function() {
  gulp.watch('src/**/*.scss', gulp.series('css', 'test:visual:css', 'reload'));
});

gulp.task('watch:js', function() {
  gulp.watch('src/**/*.js', gulp.series('js', 'reload'));
});

gulp.task('watch:test:css', function() {
  gulp.watch(['src/**/*.scss', 'test/visual/scss/**/*.scss'], gulp.series('test:visual:css', 'reload'));
});

gulp.task('watch:test:js', function() {
  gulp.watch(['src/**/*.js', 'test/visual/js/**/*.js'], gulp.series('test:visual:js', 'reload'));
});

gulp.task('watch:test:pages', function() {
  gulp.watch('test/visual/pages/**/*.+(html|nunjucks|njk|md)', gulp.series('test:visual:pages', 'reload'));
});

gulp.task('watch:test', gulp.parallel('watch:test:css', 'watch:test:js', 'watch:test:pages'));


// ----------------------------------------------------------------------------
// CLEAN
// ----------------------------------------------------------------------------
gulp.task('clean', function() {
  return del([libraryDest, '.temp']);
});


// ----------------------------------------------------------------------------
// TEST
// ----------------------------------------------------------------------------
let getPackageData = function(file) {
  // Returns package.json as variable package
  // to use it in Nunjucks templates like this {{ package.version }}
  return {
    'package': pkg,
  };
}

gulp.task('test:visual:css', function() {
  return gulp.src('test/visual/scss/test.scss')
    .pipe(_.sass({precision: 10}))
    .pipe(_.autoprefixer({
      browsers: ['last 2 version']
    }))
    .pipe(gulp.dest(`${testFolder}/assets/css`));
});

gulp.task('test:visual:js', function() {
  return gulp.src('test/visual/js/test.js')
    .pipe(webpackStream(webpackConfigTest, webpack))
    .pipe(gulp.dest(`${testFolder}/assets/js`));
});

gulp.task('test:visual:pages', function() {
  return gulp.src(['test/visual/pages/**/*.+(html|nunjucks|njk|md)', '!test/visual/pages/_**/*.*', '!test/visual/pages/_*.*'])
    .pipe(_.data(getPackageData))
    .pipe(_.nunjucksRender(nunjucksConfig))
    .pipe(gulp.dest(`${testFolder}`));
});

gulp.task('test:visual:content', function() {
  return gulp.src(['test/visual/content/**/*.*'])
    .pipe(gulp.dest(`${testFolder}/assets/content`));
});

gulp.task('test:visual:fonts', function() {
  return gulp.src(['./node_modules/@audi/audi-type/dist/fonts/**/*.{woff,woff2,ttf}'])
    .pipe(gulp.dest(`${testFolder}/assets/fonts`));
});

gulp.task('test:visual:svg', function() {
  return gulp.src(['node_modules/@audi/audi-icon/dist/svg/sprite/sprite.svg'])
    .pipe(gulp.dest(`${testFolder}/assets/svg`));
});

gulp.task('test:visual',
  gulp.series(
    gulp.parallel('clean'),
    gulp.parallel('css', 'js'),
    gulp.parallel('test:visual:svg', 'test:visual:css', 'test:visual:js', 'test:visual:pages', 'test:visual:content', 'test:visual:fonts'),
    gulp.parallel('serve:test', 'watch:test')
  )
);

// ----------------------------------------------------------------------------
// DEFAULT
// ----------------------------------------------------------------------------
gulp.task('default', gulp.series('clean', 'css', 'js'));
