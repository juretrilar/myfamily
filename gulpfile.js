let gulp = require('gulp');
let gutil = require('gulp-util');

let useref = require('gulp-useref');
let ejs = require("gulp-ejs");
let sourcemaps = require('gulp-sourcemaps');
let lazypipe = require('lazypipe');

let minifyejs = require('gulp-minify-ejs')
var uglify = require('gulp-uglify')
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');

var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');

var del = require('del');
let replace = require('gulp-replace');

var runSequence = require('run-sequence');

const babel = require('gulp-babel');



gulp.task('default',  ['js', 'uglify'],() => {
    gulp.watch([
    './node_modules/getmdl-select/src/js/getmdl-select.js',
    './node_modules/draggabilly/dist/draggabilly.pkgd.js',
    './node_modules/md-date-time-picker/dist/js/mdDateTimePicker.js',
    './public/scripts/jquery.simplePagination.js',
    './public/scripts/monthly.js',
    './public/scripts/dialog-polyfill.js',
    './public/scripts/querydb.js',
    './public/scripts/dialog.js',
    './public/scripts/dialog.js',
    './public/scripts/firebaseConfig.js',
    './node_modules/chart.js/src/chart.js'], ['js']);
});

gulp.task('useref', function(){
    return gulp.src('**/*.ejs')
    .pipe(replace(/\/uploads\//g, 'public/images/uploads/'))
    .pipe(replace(/\/scripts\/prijava.js/g, 'public/js/prijava.js'))        
    .pipe(useref({}, lazypipe().pipe(sourcemaps.init)))
        .pipe(sourcemaps.mapSources(function(sourcePath, file) {
            return '' + sourcePath;
        }))
        .pipe(sourcemaps.write(''))
    .pipe(gulpIf('*.js', uglify().on('error', function(error) {
        // we have an error
        console.log(error);
        })))
    /*
    .pipe(useref().on('error', errorHandler))
    .pipe(minifyejs())    */
    
    .pipe(gulpIf('public/**/*.css', cssnano()))
    .pipe(replace(/\/images\/header/g, 'public/images/images/header'))  
    .pipe(gulp.dest('dist/app'))
});

gulp.task('sw', function(){
    return gulp.src('public/sw.js')
    .pipe(gulp.dest('dist/app/public'))
});

gulp.task('login', function(){
    return gulp.src('public/scripts/prijava.js')
    .pipe(gulp.dest('dist/app/public/js'))
});

gulp.task('images', function(){
    return gulp.src('public/**/*.+(png|jpg|jpeg|gif|svg|ico)')
    .pipe(cache(imagemin()))
    .pipe(gulp.dest('dist/app/public/images'))
});

gulp.task('clean:dist', function() {
    return del.sync('dist');
  })

gulp.task('build', function (callback) {
    runSequence('clean:dist', 
        ['useref', 'images', 'login', 'sw'],    
        callback
    )
})

gulp.task('uglify', () => {
    return gulp.src(['./public/scripts/es6/jquery.simplePagination.js',
    './public/scripts/es6/monthly.js',
    './public/scripts/es6/dialog-polyfill.js',
    './public/scripts/es6/querydb.js',
    './public/scripts/es6/dialog.js',
    './public/scripts/es6/firebaseConfig.js',
    './public/scripts/es6/prijava.js'])
        .pipe(babel({
            presets: ['env'],
            plugins: ["transform-member-expression-literals", 
            "transform-merge-sibling-variables", 
            "transform-minify-booleans", 
            "transform-property-literals"]
        }))
        .pipe(gulpIf('*.js', uglify().on('error', function(error) {
            // we have an error
            console.log(error);
          })))
        .pipe(gulp.dest('./public/scripts'));
});


gulp.task('js', () => {
    return gulp.src(['./node_modules/getmdl-select/getmdl-select.min.js',    
    './node_modules/draggabilly/dist/draggabilly.pkgd.min.js',
    './node_modules/md-date-time-picker/dist/js/mdDateTimePicker.min.js',
    './node_modules/chart.js/dist/Chart.min.js'])
        .pipe(babel({
            presets: ['env'],
            plugins: ["transform-member-expression-literals", 
            "transform-merge-sibling-variables", 
            "transform-minify-booleans", 
            "transform-property-literals"]
        }))
        .pipe(gulp.dest('./public/scripts'));
});

function errorHandler (error) {
    console.log(error.toString());
    this.emit('end');
}
