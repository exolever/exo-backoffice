/*jslint node: true */
'use strict';

var debug = require('gulp-debug');
var path = require('path');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var conf = require('./conf');
var runSequence = require('run-sequence');
var useref = require('gulp-useref');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

gulp.task('html', ['inject'], function () {
  var htmlFilter = $.filter('*.html', { restore: true });
  var jsFilter = $.filter('**/*.js', { restore: true });
  var cssFilter = $.filter('**/*.css', { restore: true });
  var assets;

  return gulp.src(path.join(conf.paths.tmp, '/serve/base.tpl'))
    .pipe($.rename('base.html'))
    .pipe(assets = useref.assets())
    .pipe($.rev())
    .pipe(jsFilter)
    .pipe($.sourcemaps.init())
    .pipe($.ngAnnotate())
    .pipe(uglify()).on('error', conf.errorHandler('Uglify'))
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe($.sourcemaps.init())
    .pipe($.replace('../../bower_components/bootstrap/fonts/', '../../static/fonts/'))
    .pipe($.replace('../../bower_components/fontawesome/fonts/', '../../static/fonts/'))
    .pipe($.replace('../img/', '../assets/plugins/x-editable/'))
    .pipe($.minifyCss({ processImport: false }))
    .pipe(cssFilter.restore)
    .pipe(assets.restore())
    .pipe(useref())
    .pipe($.revReplace())
    .pipe(htmlFilter)
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true,
      conditionals: true
    }))
    .pipe(htmlFilter.restore)
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
    .pipe($.size({ title: path.join(conf.paths.dist, '/'), showFiles: true }));
  });

gulp.task('other', function () {
  var fileFilter = $.filter(function (file) {
    return file.stat.isFile();
  });

  return gulp.src([
      path.join(conf.paths.src, '/**/*'),
      path.join('!' + conf.paths.src, '/**/*.{html,css,js,less,tpl}')
    ])
    .pipe(fileFilter)
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')));
});

gulp.task('django', function(){
  return gulp.src(path.join(conf.paths.dist, "/{index,base}.html"))
    .pipe($.replace('src="scripts', 'src="{% static "scripts'))
    .pipe($.replace('.js"></script>','.js" %}"></script>'))
    .pipe($.replace('href="styles','href="{% static "styles'))
    .pipe($.replace('.css"','.css" %}"'))
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')));
});

gulp.task('index', function(){
  return gulp.src(path.join(conf.paths.dist, "/{index,base}.html"))
    .pipe(gulp.dest(path.join(conf.paths.dist_index, "/")));
});

gulp.task('move_scripts', function(){
  return gulp.src(path.join(conf.paths.dist, "/scripts/**"))
    .pipe(gulp.dest(path.join(conf.paths.dist_static, "/scripts/")));
});

gulp.task('move_styles', function(){
  return gulp.src(path.join(conf.paths.dist, "/styles/**"))
    .pipe(gulp.dest(path.join(conf.paths.dist_static, "/styles/")));
});

gulp.task('move_fonts', function(){
  return gulp.src(path.join(conf.paths.dist, "/fonts/**"))
    .pipe(gulp.dest(path.join(conf.paths.dist_static, "/fonts/")));
});

gulp.task('move_theme', function(){
  return gulp.src(path.join(conf.paths.dist, "/theme/**"))
    .pipe(gulp.dest(path.join(conf.paths.dist_static, "/theme/")));
});

gulp.task('move_assets', function(){
  return gulp.src(path.join(conf.paths.dist, "/assets/**"))
    .pipe(gulp.dest(path.join(conf.paths.dist_static, "/assets/")));
});

gulp.task('clean', function () {
  return $.del([path.join(conf.paths.dist, '/'), path.join(conf.paths.tmp, '/')]);
});

gulp.task('build', function(callback){
  runSequence(['html', 'other'],
    'django', 'index',
    'move_scripts', 'move_styles',
    'move_fonts', 'move_theme', 'move_assets', callback);
});
