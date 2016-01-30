/// <binding Clean='clean' ProjectOpened='watch' />
"use strict";

var gulp = require('gulp');
var concat = require('gulp-concat');
var cssmin = require("gulp-cssmin");
var uglify = require("gulp-uglify");
var watch = require('gulp-watch');
var del = require('del');
var rimraf = require("rimraf");
 
var outputLocation = 'lib';
 
gulp.task('clean', function () {
    del.sync([outputLocation + '/**']);
});

gulp.task('min:js:admin', function () {
    return gulp.src(['lib/admin/**/*.js', '!lib/admin/**/*.min.js'], { base: "." })
    .pipe(concat('lib/admin/app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest("."));
});

gulp.task('min:js:pfb', function () {
    return gulp.src(['lib/pfb-wizard/**/*.js', '!lib/pfb-wizard/**/*.min.js'], { base: "." })
    .pipe(concat('lib/pfb-wizard/app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest("."));
});

gulp.task('min:js', ['min:js:admin', 'min:js:pfb'], function () { });

gulp.task('watch', function () {
    gulp.watch('lib/**/*', ['min:js']);
});

gulp.task('default', ['clean', 'min:js', 'watch'], function(){});
