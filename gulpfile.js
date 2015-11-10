// Plugins
// -------
var gulp = require('gulp'),
    cache = require('gulp-cache'),
    imagemin = require('gulp-imagemin'),
    inlineCss = require('gulp-inline-css'),
    jade = require('gulp-jade'),
    minifycss = require('gulp-minify-css'),
    notify = require('gulp-notify'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass');

// Variables
// ---------
var dist = 'dist/',
    source = 'source/';

// Error Handling
// --------------
function handleError() {
  this.emit('end');
}


// Build Tasks
// -----------
gulp.task('responsive_styles', function(){
  gulp.src(source + 'css/responsive.css')
    .pipe(minifycss())
    .pipe(rename('responsive.min.css'))
    .pipe(gulp.dest(source));
});

gulp.task('main_styles', function(){
  gulp.src(source + 'css/style.scss')
    .pipe(sass())
    .pipe(minifycss())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest(source));
});

gulp.task('images', function(){
  return gulp.src(source + 'img/*')
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest(dist+'img'));
});

gulp.task('templates', ['main_styles', 'responsive_styles'], function(){
  gulp.src(source + '*.jade')
    .pipe(jade({

    }))
      .on('error', handleError)
      .on('error', notify.onError())
    .pipe(inlineCss({
      applyStyleTags: false,
      applyLinkTags: true,
      removeLinkTags: true,
      removeStyleTags: false
    }))
    .pipe(gulp.dest(dist));
});

gulp.task('default', function(){
  gulp.watch([source + '*.jade', source + 'css/*'], ['templates']);
  gulp.watch(source+'img/*', ['images']);
});

gulp.task('build', ['templates']);