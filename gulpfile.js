require('./geo-json-task.js');
require('./geojson-filter-task.js');
require('./pharmacy-geo-gulp-task.js');

const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const gutil = require('gulp-util');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const inject = require('gulp-inject');
const sequence = require('gulp-sequence');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const del = require('del');
const templateCache = require('gulp-angular-templatecache');


const THIRD_PARTY = ['d3', 'lodash', 'mapbox', 'angular', 'highcharts'];

const CONFIG = {
    dest: 'dist',
    entry: 'app/app.js'
};

gulp.task('default', sequence(
    ['generate-geo.json', 'filter-geojson', 'templateCache', 'pharmacy-geo'],
    ['sass', 'build:app', 'build:vendor', 'watch'],
    'index',
    'connect'));

gulp.task('watch', function () {
    gulp.watch(['app/**/*.scss'], ['sass']);
    gulp.watch(['app/**/*.js'], ['build:app']);
    gulp.watch(['app/**/*.html'], ['templateCache']);
    gulp.watch('index.html').on('change', browserSync.reload);
    gulp.watch(`${CONFIG.dest}/**/*.*`).on('change', browserSync.reload);
});

gulp.task('clean', function () {
    return del.sync(`${CONFIG.dest}/**/*.*`);
});

gulp.task('sass', function () {
    return gulp.src('app/**/*.scss')
        .pipe(plumber({ errorHandler: onError }))
        .pipe(sass())
        .pipe(gulp.dest(`${CONFIG.dest}`))
        .pipe(browserSync.stream());
});

gulp.task('connect', function () {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
});

gulp.task('index', function () {
    var target = gulp.src('./index.html');
    var source = gulp.src([
        `${CONFIG.dest}/vendor*.js`,
        `${CONFIG.dest}/templates.js`,
        `${CONFIG.dest}/*.js`,
        `${CONFIG.dest}/*.css`], { read: false });
    return target
        .pipe(inject(source))
        .pipe(gulp.dest(`./`));
});

gulp.task('build:vendor', function (done) {
    browserify({
        require: THIRD_PARTY,
        debug: true
    })
        .bundle()
        .on('error', gutil.log)
        .pipe(source('vendors.js'))
        .pipe(gulp.dest(CONFIG.dest));
    
    done();
});

gulp.task('build:app', function (done) {
    const appBundler = browserify({
        entries: CONFIG.entry,
        debug: true
    });

    THIRD_PARTY.forEach(function (dep) {
        appBundler.external(dep);
    });

     appBundler
        .bundle()
        .on('error', gutil.log)
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(CONFIG.dest));
    done();
});

gulp.task('templateCache', () => {
    const TEMPLATE_HEADER = `
    var angular = require('angular');
    angular.module("<%= module %>"<%= standalone %>).run(["$templateCache", function($templateCache) {`;
    return gulp.src('app/**/*.html')
        .pipe(templateCache('templates.js', {
            standalone: true,
            templateHeader: TEMPLATE_HEADER
        }))
        .pipe(gulp.dest('dist'));
});

function onError(err) {
    notify.onError({
        title: `Gulp error in ${err.plugin}`,
        message: err.messageFormatted.toString()
    })(err);
    this.emit('end');
}
