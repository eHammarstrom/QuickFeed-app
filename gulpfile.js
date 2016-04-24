const gulp = require('gulp');

// GULP plugins
const sass = require('gulp-sass');

// Produce testing css
gulp.task('test', function() {
    return gulp.src('scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('css/testing'));
});

// Produce production css
gulp.task('build', function() {
    return gulp.src('scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('css/production'));
});
