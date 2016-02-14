/// <binding BeforeBuild='default' ProjectOpened='default' />
"use strict";

var gulp = require('gulp');
var concat = require('gulp-concat');
var cssmin = require("gulp-cssmin");
var uglify = require("gulp-uglify");
var watch = require('gulp-watch');
var ngHtml2Js = require("gulp-ng-html2js");
var minifyHtml = require("gulp-minify-html");
var del = require('del');
var rimraf = require("rimraf");
 
var outputLocation = 'lib';

gulp.task("min:html:pfb", function(){
    return gulp.src("lib/pfb-wizard/Views/*.html")
    .pipe(minifyHtml({
	    empty: true,
	    spare: true,
	    quotes: true
	}))
	.pipe(ngHtml2Js({
	    moduleName: "pfb-views",
	    prefix: "/views/"
	}))
	.pipe(concat("lib/pfb-wizard/pfb-views.js"))
	.pipe(gulp.dest("."));
});

 
gulp.task('min:js:admin', function () {
    return gulp.src(['lib/admin/**/*.js', '!lib/admin/**/*.min.js'], { base: "." })
    .pipe(concat('lib/admin/app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest("."));
});

gulp.task('min:js:pfb', ['min:html:pfb'], function () {
    return gulp.src(['lib/pfb-wizard/pfb-views.js', 'lib/pfb-wizard/**/*.js', '!lib/pfb-wizard/**/*.min.js'], { base: "." })
    .pipe(concat('lib/pfb-wizard/pfb.min.js'))
    //.pipe(uglify())
    .pipe(gulp.dest("."));
});

gulp.task('min:js', ['min:js:admin', 'min:html:pfb', 'min:js:pfb'], function () { });

gulp.task('watch', function () {
    gulp.watch('lib/**/*', ['min:js']);
});

gulp.task('default', ['min:js'], function(){});
