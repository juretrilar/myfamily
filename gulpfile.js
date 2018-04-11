let gulp = require('gulp');

let useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');

var cssnano = require('gulp-cssnano');

var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');

var del = require('del');

var runSequence = require('run-sequence');

gulp.task('useref', function(){
    return gulp.src('views/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});

gulp.task('images', function(){
    return gulp.src('public/**/*.+(png|jpg|jpeg|gif|svg)')
    .pipe(cache(imagemin()))
    .pipe(gulp.dest('dist/images'))
});

gulp.task('clean:dist', function() {
    return del.sync('dist');
  })

gulp.task('build', function (callback) {
    runSequence('clean:dist', 
        ['sass', 'useref', 'images', 'fonts'],
        callback
    )
})