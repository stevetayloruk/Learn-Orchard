var gulp = require('gulp');
var pkg = require('./package.json');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');

var del = require('del');

var log = $.util.log;
var reload = browserSync.reload;



/**
 * SCSS to CSS
 * @return {Stream}
 */
gulp.task('sass', function() {

	log('Preprocessing SCSS');

	var source = [].concat(pkg.files.sass);

	return gulp.src(source)
		.pipe($.rubySass())
	    .pipe(gulp.dest(pkg.paths.css));
});

/**
 * Concat and minify CSS
 * @return {Stream}
 */
gulp.task('css', ['sass'], function() {

    log('Bundling, minifying, and copying the CSS');

    var source = [].concat(pkg.files.css);

    return gulp.src(source)
        .pipe($.concat('all.min.css'))
        .pipe($.autoprefixer('last 2 version', '> 5%'))
        .pipe($.bytediff.start())
        .pipe($.minifyCss({}))
        .pipe($.bytediff.stop())
        .pipe(gulp.dest(pkg.paths.build));
});

/**
 * Check the JS
 * @return {Stream}
 */
gulp.task('jshint', function () {

	log('Checking the JavaScript');

	var source = [].concat(pkg.files.js);
  	
  	return gulp.src(source)
    	.pipe($.jshint())
    	.pipe($.jshint.reporter('jshint-stylish'))
});

/**
 * Concat and minify JS
 * @return {Stream}
 */
 gulp.task('js', ['jshint'], function() {
    
    log('Bundling, minifying, and copying the JavaScript');

    var source = [].concat(pkg.files.js);
    
    return gulp
        .src(source)
        .pipe($.concat('all.min.js'))
        .pipe($.ngAnnotate({add: true, single_quotes: true}))
        .pipe($.bytediff.start())
        .pipe($.uglify({mangle: true}))
        .pipe($.bytediff.stop())
        .pipe(gulp.dest(pkg.paths.build));
});

 /**
 * Delete old files
 * @return {Stream}
 */
gulp.task('clean', function() {

    log('Cleaning...');

    var source = [].concat(pkg.files.clean);

    del(source, function () {
    	log('Files deleted');
	});
});

// Reload all Browsers
gulp.task('full-reload', function () {
    browserSync.reload();
});

 gulp.task('browser-sync', function() {
	browserSync({
    	server: {
      		baseDir: './'
    	}
  	});
});

 // Watch scss AND html files, doing different things with each.
gulp.task('default', ['browser-sync'], function () {
	var sassFiles = [].concat(pkg.files.sass);
	var cssFiles = [].concat(pkg.files.css);

    gulp.watch(sassFiles, ['css']);
    gulp.watch(['*.html', cssFiles], ['full-reload']);
});

