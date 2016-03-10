var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jshint');
var inject = require('gulp-inject');
var nodemon = require('gulp-nodemon');

var jsFiles = ['*.js', 'src/**/*.js'];

gulp.task('style', function () {
    'use strict';
    return gulp.src(jsFiles)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish', {
            verbose: true
        }))
        .pipe(jscs());
});

gulp.task('inject', function () {
    'use strict';

    var wiredep = require('wiredep').stream,

        injectSrc = gulp.src(['./public/css/*.css', './public/js/*.js'], {
            read: false
        }),

        injectOptions = {
            ignorePath: '/public'
        },

        options = {
            bowerJson: require('./bower.json'),
            directory: './public/lib',
            ignorePath: '../../public'
        };

    return gulp.src('./src/views/*.jade')
        .pipe(wiredep(options))
        .pipe(inject(injectSrc, injectOptions))
        .pipe(gulp.dest('./src/views'));
});

gulp.task('serve', ['style', 'inject'], function () {
    'use strict';
    var options = {
        script: 'app.js',
        delayTime: 1,
        env: {
            'PORT': 5001
        },
        watch: jsFiles
    };
    return nodemon(options)
        .on('restart', function (ev) {
            console.log('Restarting...');
        });
});