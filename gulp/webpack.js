/*jslint node: true */
'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var shell = require('gulp-shell');
var gulpif = require('gulp-if');
var argv = require('yargs').argv;
var runSequence = require('run-sequence');
var del = require('del');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

gulp.task('index-backup', function(){
  return gulp.src(path.join(conf.paths.angular2, "/index.html"))
    .pipe(gulp.dest(path.join(conf.paths.dist_index, "/dist/")));
});

gulp.task('remove-index-backup', function(){
  return del(path.join(conf.paths.dist_index, "/dist/index.html"), {force: true});
});

gulp.task('webpack_cmd', function() {
  	var isProduction = (argv.production === undefined) ? false : true;
  	return gulp.src('')
  	  .pipe(gulpif(isProduction,
                   shell('cd ../angular2 && ng build --aot --prod --output-hashing all'),
                   shell('cd ../angular2 && ng build --output-hashing all')))
      .pipe(gulp.dest('output'));
});

gulp.task('djangonize', function(){
  return gulp.src(path.join(conf.paths.angular2, "/index.html"))
    .pipe($.replace('x-icon" href="', 'x-icon" href="{% static "'))
    .pipe($.replace('favicon.ico"', 'favicon.ico" %}"'))
    // Icons for Apple
    .pipe($.replace('precomposed" href="', 'precomposed" href="{% static "'))
    .pipe($.replace('.png" sizes', '.png" %}" sizes'))
    // Scripts
    .pipe($.replace('src="', 'src="{% static "scripts/'))
    .pipe($.replace('.js"></script>','.js" %}"></script>'))
    .pipe($.replace('href="styles','href="{% static "styles/styles'))
    .pipe($.replace('.css"','.css" %}"'))
    .pipe($.replace('font-awesome.min.css" %}"',
                    'font-awesome.min.css"'))
    .pipe(gulp.dest(path.join(conf.paths.angular2, '/')));
});

gulp.task('public_js', function(){
  var fileFilter = $.filter(function (file) {
    return file.stat.isFile();
  });

  return gulp.src(path.join(conf.paths.angular2, '/*.js'))
    .pipe(fileFilter)
    .pipe(gulp.dest(path.join(conf.paths.dist, '/scripts')))
    .pipe($.size({
    	title: path.join(conf.paths.dist, '/'),
    	showFiles: true
    	}
    ));
});

gulp.task('public_map', function(){
  var fileFilter = $.filter(function (file) {
    return file.stat.isFile();
  });

  return gulp.src(path.join(conf.paths.angular2, '/*.map'))
    .pipe(fileFilter)
    .pipe(gulp.dest(path.join(conf.paths.dist, '/maps/scripts')))
    .pipe($.size({
      title: path.join(conf.paths.dist, '/'),
      showFiles: true
      }
    ));
});

gulp.task('public_css', function(){
  var fileFilter = $.filter(function (file) {
    return file.stat.isFile();
  });

  return gulp.src(path.join(conf.paths.angular2, '/*.css'))
    .pipe(fileFilter)
    .pipe(gulp.dest(path.join(conf.paths.dist, '/styles')))
    .pipe($.size({
    	title: path.join(conf.paths.dist, '/'),
    	showFiles: true
    	}
    ));
});

gulp.task('public_fonts', function(){
  var fileFilter = $.filter(function (file) {
    return file.stat.isFile();
  });

  return gulp.src(path.join(conf.paths.angular2, '/*.{ttf,worff,woff2}'))
    .pipe(fileFilter)
    .pipe(gulp.dest(path.join(conf.paths.dist, '/styles')))
    .pipe($.size({
    	title: path.join(conf.paths.dist, '/'),
    	showFiles: true
    	}
    ));
});

gulp.task('assets', function(){
  var fileFilter = $.filter(function (file) {
    return file.stat.isFile();
  });

  return gulp.src(path.join(conf.paths.angular2, '/assets/**/*.*'))
    .pipe(fileFilter)
    .pipe(gulp.dest(path.join(conf.paths.dist, '/assets')))
    .pipe($.size({
    	title: path.join(conf.paths.dist, '/'),
    	showFiles: true
    	}
    ));
});

gulp.task('webpack', function(callback){
      var isWebpack = (argv.webpack !== undefined) ? true : false;
      if (isWebpack){
          runSequence(
              'index-backup',
              'webpack_cmd',
              'djangonize',
              ['public_js', 'public_map', 'public_css', 'public_fonts', 'assets'],
              callback);
      }

});
