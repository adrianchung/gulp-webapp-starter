var gulp = require('gulp');
var connect = require('gulp-connect');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var less = require('gulp-less');
var clean = require('gulp-clean');
var watch = require('gulp-watch');
var preprocess = require('gulp-preprocess');
var bower = require('gulp-bower')
var path = require('path');

var checkstyleFileReporter = require('jshint-checkstyle-file-reporter');
process.env.JSHINT_CHECKSTYLE_FILE = 'checkstyle-result.xml';

gulp.task('default', ['clean'], function() {
    return gulp.start('build');
});

gulp.task('build', ['js', 'bower', 'jshint', 'images', 'html', 'less', 'css', 'fonts']);
gulp.task('build-dist', ['build', 'js-dist', 'css-dist']);

gulp.task('clean', function() {
    return gulp
        .src(['dist/*', 'public/*'], {read: false})
        .pipe(clean());
});

var bowerSrcs = ['./src/bower_components/**'];
gulp.task('bower', function () {
    return gulp
        .src(bowerSrcs)
        .pipe(gulp.dest('./public/bower_components'))
        .pipe(gulp.dest('./dist/bower_components'));
});

var jsSrcs = ['./src/**/*.js', '!./src/bower_components/**'];
gulp.task('js', function() {
    return gulp
        .src(jsSrcs)
        .pipe(gulp.dest('./public/'))
        .pipe(connect.reload());
});

gulp.task('js-dist', function() {
    return gulp
        .src('./public/js/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js/'))
});

gulp.task('jshint', function() {
    return gulp
        .src(jsSrcs)
        .pipe(jshint())
        .pipe(jshint.reporter(checkstyleFileReporter))
        .pipe(jshint.reporter('fail'));
});

var imagesSrc = ['./src/**/*.png', './src/**/*.gif', './src/**/*.ico', './src/**/*.jpg', '!./src/bower_components/**'];
gulp.task('images', function() {
    return gulp
        .src(imagesSrc)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('./dist/'))
        .pipe(gulp.dest('./public/'))
        .pipe(connect.reload());
});

var htmlSrcs = ['./src/**/*.html'];
gulp.task('html', function () {
    return gulp
        .src(htmlSrcs)
        .pipe(preprocess())
        .pipe(gulp.dest('./dist/'))
        .pipe(gulp.dest('./public/'))
        .pipe(connect.reload());
});

var lessSrcs = ['./src/**/*.less', '!./src/bower_components/**'];
gulp.task('less', function() {
    return gulp
        .src(lessSrcs)
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(minifyCSS({comments: true, spare: true}))
        .pipe(gulp.dest('./public/'))
        .pipe(connect.reload());
});

var cssSrcs = ['./src/**/*.css', '!./src/bower_components/**'];
gulp.task('css', function() {
    return gulp
        .src(cssSrcs)
        .pipe(minifyCSS({comments: true, spare: true}))
        .pipe(gulp.dest('./public/'))
        .pipe(connect.reload());
});

gulp.task('css-dist', function() {
    return gulp
        .src('./public/css/**/*.css')
        .pipe(gulp.dest('./dist/css/'));
});

var fontsSrcs = [
    './src/**/*.woff2',
    './src/**/*.woff',
    './src/**/*.ttf',
    '!./src/bower_components/**'
];
gulp.task('fonts', function() {
    return gulp
        .src(fontsSrcs)
        .pipe(gulp.dest('./dist/'))
        .pipe(gulp.dest('./public/'))
        .pipe(connect.reload());
});

gulp.task('watch', ['default'], function() {
    gulp.watch(jsSrcs, ['js', 'jshint']);
    gulp.watch(bowerSrcs, ['bower']);
    // TODO(AC) Image watching doesn't work so you need to manually `gulp images`
    //gulp.watch(imagesSrc, ['images']);
    gulp.watch(htmlSrcs, ['html']);
    gulp.watch(lessSrcs, ['less']);
    gulp.watch(cssSrcs, ['css']);
    gulp.watch(fontsSrcs, ['fonts']);
});

gulp.task('connect', ['watch'], function() {
    connect.server({
        root: './public/',
        port: 8888,
        livereload: true
    });
});
