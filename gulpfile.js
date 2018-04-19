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
    './public/scripts/es6/jquery.simplePagination.js',
    './public/scripts/es6/monthly.js',
    './public/scriptses6//dialog-polyfill.js',
    './public/scripts/es6/querydb.js',
    './public/scripts/es6/dialog.js',
    './public/scripts/es6/firebaseConfig.js',
    './node_modules/chart.js/src/chart.js'], ['uglify', 'js']);
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
    .pipe(gulpIf('public/**/*.css', cssnano()))
    .pipe(replace(/<%= uporabniki\[j\]\.slika %>/g, 'public/images<%= uporabniki[j].slika %>'))  
    .pipe(replace(/<%= slika\[naloge\[i\]\.vezani_uporabniki\[j\]\]\[0\]/g, 'public/images<%= slika[naloge[i].vezani_uporabniki[j]][0]')) 
    .pipe(replace(/<%= slika\[naloge\[i\]\.avtor\]\[0\]/g, 'public/images<%= slika[naloge[i].avtor][0]'))    
    .pipe(replace(/<%= opomniki\[i\]\.vezani_uporabniki\[j\]\.slika/g, 'public/images<%= opomniki[i].vezani_uporabniki[j].slika'))       
    .pipe(replace(/\/images\/header/g, '../images/images/header'))  
    .pipe(gulp.dest('dist/app'))
});

gulp.task('sw', function(){
    return gulp.src('public/sw.js')
    .pipe(gulp.dest('dist/app'))
});

gulp.task('login', function(){
    return gulp.src('public/scripts/prijava.js')
    .pipe(gulp.dest('dist/app/public/js'))
});

gulp.task('mdpicker', function(){
    return gulp.src('./node_modules/md-date-time-picker/dist/images/*')
    .pipe(gulp.dest('dist/app/public/images'))
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
        ['useref', 'images', 'login', 'sw', 'mdpicker'],    
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
    './node_modules/md-date-time-picker/dist/js/mdDateTimePicker.js',
    './node_modules/chart.js/dist/Chart.min.js'])
    /*
        .pipe(babel({
            presets: ['env'],
            plugins: ["transform-member-expression-literals", 
            "transform-merge-sibling-variables", 
            "transform-minify-booleans", 
            "transform-property-literals"]
        }))*/
        .pipe(gulp.dest('./public/scripts'));
});

function errorHandler (error) {
    console.log(error.toString());
    this.emit('end');
}
