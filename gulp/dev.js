/*jslint node: true */
'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var argv = require('yargs').argv;
var useref = require('gulp-useref');

var runSequence = require('run-sequence');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

gulp.task('html-dev', ['inject'], function () {

  var assets;
  var htmlFilter = $.filter('*.html', { restore: true });
  var jsFilter = $.filter('**/*.js', { restore: true });
  var cssFilter = $.filter('**/*.css', { restore: true });

  return gulp.src(path.join(conf.paths.tmp, '/serve/base.tpl'))
    .pipe($.rename('base.html'))
    .pipe(assets = useref.assets())
    .pipe(jsFilter)
    .pipe($.sourcemaps.init({loadMaps: true}))
    .pipe($.sourcemaps.write('static/maps'))
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe($.sourcemaps.init({loadMaps: true}))
    .pipe($.replace('../../bower_components/bootstrap/fonts/', '../../static/fonts/'))
    .pipe($.replace('../../bower_components/fontawesome/fonts/', '../../static/fonts/'))
    .pipe($.replace('../img/', '../assets/plugins/x-editable/'))
    .pipe($.sourcemaps.write('static/maps'))
    .pipe(cssFilter.restore)
    .pipe(assets.restore())
    .pipe(useref())
    .pipe($.revReplace())
    .pipe($.sourcemaps.write('static/maps'))
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
    .pipe($.size({ title: path.join(conf.paths.dist, '/'), showFiles: true }));
  });


gulp.task('html-dev-scripts', ['inject-scripts'], function () {

  var assets;

  return gulp.src(path.join(conf.paths.tmp, '/serve/base.tpl'))
    .pipe($.rename('base.html'))
    .pipe(assets = useref.assets())
    .pipe(assets.restore())
    .pipe(useref())
    .pipe($.revReplace())
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
    .pipe($.size({ title: path.join(conf.paths.dist, '/'), showFiles: true }));
  });

gulp.task('html-dev-styles', ['inject-styles'], function () {
  var assets;

  return gulp.src(path.join(conf.paths.tmp, '/serve/base.tpl'))
    .pipe($.rename('base.html'))
    .pipe(assets = useref.assets())
    .pipe($.replace('../../bower_components/bootstrap/fonts/', '../../static/fonts/'))
    .pipe($.replace('../../bower_components/fontawesome/fonts/', '../../static/fonts/'))
    .pipe($.replace('../img/', '../assets/plugins/x-editable/'))
    .pipe(assets.restore())
    .pipe(useref())
    .pipe($.revReplace())
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
    .pipe($.size({ title: path.join(conf.paths.dist, '/'), showFiles: true }));
  });

gulp.task('dev', function(callback){
  runSequence(['html-dev', 'other'],
    'django', 'index',
    'move_scripts', 'move_styles',
    'move_fonts', 'move_theme', 'move_assets', callback);
});
