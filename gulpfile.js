// General
var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    watch = require('gulp-watch'),
    sass = require('gulp-sass'),
    sourceMaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create(),
    header = require('gulp-header'),
    rename = require('gulp-rename'),
    eslint = require('gulp-eslint'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    codekit = require('gulp-codekit'),
    package = require('./package.json'),
    imagemin = require('gulp-imagemin');
    imageminPngquant = require('imagemin-pngquant');
    imageminZopfli = require('imagemin-zopfli');
    imageminMozjpeg = require('imagemin-mozjpeg'); 
    imageminGiflossy = require('imagemin-giflossy');
    paths = package.paths;

var banner = [
  '/*!\n' +
  ' * @version <%= package.version %>\n' +
  ' * @author <%= package.author %>\n' +
  ' * <%= package.url %>\n' +
  ' * Copyright ' + new Date().getFullYear() + '. <%= package.license %> licensed.\n' +
  ' */',
  '\n'
].join('');

gulp.task('html', function(){
    return gulp.src('*.html');
});

gulp.task('styles', function () {
    return gulp.src(paths.cssdev + '/*.scss')
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(sourceMaps.init())
        .pipe(sass({
            outputStyle: 'expanded'
        }))
        .pipe(autoprefixer())
        .pipe(sourceMaps.write(undefined, {
            sourceRoot: null
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.css))
        .pipe(browserSync.stream());
});

gulp.task('styles:prod', function () {
    return gulp.src(paths.cssdev + '/*.scss')
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(autoprefixer())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(header(banner, {
            package: package
        }))
        .pipe(gulp.dest(paths.css))
});

gulp.task('scripts', function () {
    gulp.src(paths.jsdev + '/*.js')
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(sourceMaps.init())
        .pipe(codekit())
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        .pipe(sourceMaps.write(undefined, {
            sourceRoot: null
        }))
        .pipe(concat('app.js'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.js))
        .pipe(browserSync.stream());
    
});

gulp.task('scripts:prod', function () {
    gulp.src(paths.jsdev + '/*.js')
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(codekit())
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.js));
});

// image compress
gulp.task('image', function(){
    return gulp.src('img/**.{png,jpg,gif,svg,ico}')
    .pipe(imagemin([
        //png
        imageminPngquant({
            speed: 1,
            quality: 98 
        }),
        imageminZopfli({
            more: true
        }),
        imageminGiflossy({
            optimizationLevel: 3,
            optimize: 3, 
            lossy: 2
        }),
        //svg
        imagemin.svgo({
            plugins: [{
                removeViewBox: false
            }]
        }),
        imagemin.jpegtran({
            progressive: true
        }),
        imageminMozjpeg({
            quality: 90
        })
    ]))
    .pipe(gulp.dest('img/compressed'));
});

// task: watch
gulp.task('watch', function () {
    gulp.watch('*.html', ['watch-html']);
    gulp.watch(paths.cssdev + '/**/*.scss', ['styles']);
    gulp.watch(paths.jsdev + '/**/*.js', ['scripts']);
    gulp.watch('img/**.{png,jpg,gif,svg,ico}', ['watch-img']);
    browserSync.init({
        notify: false,
        injectChanges: true,
        server:{
            baseDir: "./"
        },
    });
});

// task: default
gulp.task('default', ['html', 'styles', 'scripts', 'watch', 'image']);

// html
gulp.task('watch-html', ['html'], function(done){
    browserSync.reload();
    done();
});

// images
gulp.task('watch-image', ['image'], function(done){
    browserSync.reload();
    done();
});

// task: production
gulp.task('prod', ['styles:prod', 'scripts:prod']);



