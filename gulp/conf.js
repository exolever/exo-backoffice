/**
 *  This file contains the variables used in other gulp files
 *  which defines tasks
 *  By design, we only put there very generic config values
 *  which are used in several places to keep good readability
 *  of the tasks
 */

var gutil = require('gulp-util');
var fs = require('fs');
var filter = require('gulp-filter');

/**
 *  The main paths of your project handle these with care
 */
exports.paths = {
  src: 'src',
  dist: 'dist',
  angular2Fonts: '../angular2/src/fonts',
  angular2: '../angular2/dist',
  tmp: '.tmp',
  e2e: 'e2e',
  css: 'src/app/css',
  base: "base.tpl",
  dist_index: 'dist/templates',
  dist_static: 'dist/static'
  //base: "../frontend/templates/base.tpl",
  //dist_index: '../frontend/templates'
};

exports.customFilters = {
    fontFilter: filter('**/*.{eot,svg,ttf,woff,woff2}'),
    fontFilterRegex: new RegExp('.*(eot|svg|ttf|woff|woff2)$', 'i')
};

/**
 *  Wiredep is the lib which inject bower dependencies in your project
 *  Mainly used to inject script tags in the index.html but also used
 *  to inject css preprocessor deps and js files in karma
 */
exports.wiredep = {
  directory: 'bower_components'
};

/**
 *  Common implementation for an error handler of a Gulp plugin
 */
exports.errorHandler = function(title) {
  'use strict';

  return function(err) {
    gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
    this.emit('end');
  };
};
