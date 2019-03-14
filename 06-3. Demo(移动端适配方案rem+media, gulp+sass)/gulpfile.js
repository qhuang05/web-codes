/**
 * Created by hqh on 2017/5/6.
 */

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoPrefixer = require('gulp-autoprefixer'),
    cssMin = require('gulp-minify-css'),
    jsMin = require('gulp-uglify'),
    filter = require('gulp-filter');
/*
var imageMin = require('gulp-gulp-imagemin'),
    concat = require('gulp-concat'),
    reload = require('gulp-livereload');
var plugins = require('gulp-load-plugins')();
*/
gulp.task('compile-sass', function(){
    gulp.src('assets/sass/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('assets/css'))
        .pipe(autoPrefixer({
            browsers: ['last 10 versions', 'Android >= 4.0'],
            cascade: true,
            remove: true
        }))
        .pipe(gulp.dest('assets/css'));
});
gulp.task('minify-css', function(){
    gulp.src('assets/css/**/*.css')
        .pipe(cssMin())
        .pipe(gulp.dest('assets/css.min'));
});
gulp.task('minify-js', function(){
    var condition = function(f){
        if(f.path.indexOf('.min.js') != -1 || f.path.indexOf('spinningwheel.js') != -1){
            return false;
        }
        return true;
    };
    var jsFilter = filter(condition, {restore:true});
    gulp.src('assets/js/**/*.js')
        .pipe(jsFilter)
        .pipe(jsMin())
        /*.pipe(jsMin({
            mangle: {
                except: ['require', 'exports', 'module', '$', 'SpinningWheel']      //排除混淆关键字
            }
        }))*/
        .pipe(jsFilter.restore)
        .pipe(gulp.dest('assets/js.min'));
});
gulp.task('default', ['compile-sass', 'minify-css', 'minify-js']);
//gulp.task('watch', function(){
//    gulp.watch('assets/sass/**/*.scss', ['sass','css']);
//    gulp.watch('assets/js/**/*.js', ['js']);
//});
