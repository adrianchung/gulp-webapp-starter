const gulp = require('gulp');
const connect = require('gulp-connect');
const imagemin = require('gulp-imagemin');
const jshint = require('gulp-jshint');
const ngAnnotate = require('gulp-ng-annotate')
const pngquant = require('imagemin-pngquant');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const minifyCSS = require('gulp-minify-css');
const less = require('gulp-less');
const clean = require('gulp-clean');
const watch = require('gulp-watch');
const preprocess = require('gulp-preprocess');
const bower = require('gulp-bower')
const path = require('path');

const checkstyleFileReporter = require('jshint-checkstyle-file-reporter');
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

const bowerSrcs = ['./src/bower_components/**'];
gulp.task('bower', function () {
    return gulp
        .src(bowerSrcs)
        .pipe(gulp.dest('./public/bower_components'))
        .pipe(gulp.dest('./dist/bower_components'));
});

const jsSrcs = ['./src/**/*.js', '!./src/bower_components/**'];
gulp.task('js', function() {
    return gulp
        .src(jsSrcs)
        .pipe(gulp.dest('./public/'))
        .pipe(connect.reload());
});

gulp.task('js-dist', function() {
    return gulp
        .src('./public/js/**/*.js')
        .pipe(sourcemaps.init())
          .pipe(uglify())
          .pipe(ngAnnotate())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/js/'))
});

gulp.task('jshint', function() {
    return gulp
        .src(jsSrcs)
        .pipe(jshint())
        .pipe(jshint.reporter(checkstyleFileReporter))
        .pipe(jshint.reporter('fail'));
});

const imagesSrc = ['./src/**/*.png', './src/**/*.gif', './src/**/*.ico', './src/**/*.jpg', '!./src/bower_components/**'];
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

const htmlSrcs = ['./src/**/*.html'];
gulp.task('html', function () {
    return gulp
        .src(htmlSrcs)
        .pipe(preprocess())
        .pipe(gulp.dest('./dist/'))
        .pipe(gulp.dest('./public/'))
        .pipe(connect.reload());
});

const lessSrcs = ['./src/**/*.less', '!./src/bower_components/**'];
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

const cssSrcs = ['./src/**/*.css', '!./src/bower_components/**'];
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

const fontsSrcs = [
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
