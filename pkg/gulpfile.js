var gulp = require("gulp");
var connect = require("gulp-connect");
var { watchHTML, htmlTask } = require("./tasks/html");
// ----------------------------------------------------------------------------------------------------------------
var sourcemaps = require("gulp-sourcemaps");
var sass = require("gulp-sass");
var concat = require("gulp-concat");
var cleanCss = require("gulp-clean-css");
var babel = require("gulp-babel");
var uglify = require("gulp-uglify");
var {imageTask, watchImages} = require("./tasks/images");
var {mediaTask, watchMedia} = require("./tasks/media");
// ^^^^^^^-----------------------------------------------------------------------------------------------^^^^^^^^^^





function watch() {
    compileWatch();
    compileJSWatch();
    watchHTML();
    watchImages();
    watchMedia();
    connect.server({
        livereload: true,
        root: "dist"
    });
}




// ----------------------------------------------------------------------------------------------------------------
// SCSS Compile
function compile() {
    return gulp.src("src/scss/*.scss")
        .pipe(sourcemaps.init())
        .pipe(sass().on("error", sass.logError))
        .pipe(concat("style.css"))
        .pipe(cleanCss())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("dist/css"))
        .pipe(connect.reload())
}

// SCSS Compile and watch 
function compileWatch() {
    return gulp.watch("src/scss/*.scss", { ignoreInitial: false }, compile);
}

// JS Compile
function jsTask() {
    console.log("babel");
    return gulp.src("src/js/*.js")
    .pipe(sourcemaps.init())
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/js'))
    .pipe(connect.reload())
}
//JS Compile and watch 
function compileJSWatch() {
    return gulp.watch("src/js/*.js", { ignoreInitial: false }, jsTask);
}
// ^^^^^^^----------------------------------------------------------------------------------------------^^^^^^^^



function build(done) {
    compile();
    jsTask();
    imageTask();
    mediaTask();
    htmlTask();
    done();
}

exports.default = watch;
exports.build = build;