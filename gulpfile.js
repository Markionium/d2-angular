var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var dhis2Config = require('./gulphelp.js').checkForDHIS2ConfigFile();
var dhisDirectory = dhis2Config.dhisDeployDirectory;

var whenAll = require('rsvp').all;
var Builder = require('systemjs-builder');

const buildDirectory = 'build';
const docsDirectory = 'docs';

var files = [
    //Lib files
    'lib/jQuery/dist/jquery.js',


    //Src files
    'src/**/*.js',

    //Test files
    'test/fixtures/**/*.js',
    'test/mocks/**/*_mock.js',
    'test/specs/**/*_spec.js'
];

/**************************************************************************************************
 * d2-angular dev tasks
 */

gulp.task('clean', function (cb) {
    var del = require('del');
    del(buildDirectory, cb);
});

gulp.task('clean-js', function (cb) {
    var del = require('del');
    del(buildDirectory + '/**.js', cb);
});

gulp.task('test', function () {
    return gulp.src([]).pipe(runKarma());
});

gulp.task('watch', function () {
    return gulp.src([]).pipe(runKarma(true));
});

gulp.task('jshint', function () {
    return gulp.src([
        'test/specs/**/*.js',
        'src/**/*.js'
    ])
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.jshint.reporter('fail'));
});

gulp.task('jscs', function () {
    return gulp.src([
        'test/specs/**/*.js',
        'src/**/*.js'
    ]).pipe($.jscs('./.jscsrc'));
});

gulp.task('scss', function () {
    return $.rubySass(['./src/app.scss'], {loadPath: './src', style: 'expanded'})
        .on('error', function (err) {
            console.error('Error!', err.message);
        })
        //.pipe($.minifyCss())
        .pipe(gulp.dest(
            [buildDirectory, 'css'].join('/')
        ));
});

gulp.task('clean-d2-source', function (cb) {
    var del = require('del');
    del('jspm_packages/npm/d2/*.js', cb);
});

gulp.task('copy-d2-source', ['clean-d2-source'], function () {
    return gulp.src(['../d2/build/*'], {base: '../d2/build'})
        .pipe(gulp.dest('jspm_packages/npm/d2'));
});

gulp.task('build-js', ['clean-js'], function (cb) {
    var builder = new Builder({});

    builder.config({
        baseURL: './src',
        transpiler: 'babel',
        paths: {
            '*': '*.js',
            'd2-angular/*': './src/d2-angular/*.js',
            'npm:*': './jspm_packages/npm/*.js',
            'github:*': '../jspm_packages/github/*.js'
        },
        meta: {
            'npm:angular@1.4.0': {
                build: false
            },
            'npm:angular-animate@1.4.0': {
                build: false
            },
            'github:jspm/nodelibs-process@0.1.1': {
                build: false,
            },
            'npm:process@0.10.1/browser': {
                build: false
            },
            'npm:babel-runtime@5.5.8/core-js': {
                build: false
            },
            'npm:babel-runtime@5.5.8/helpers/class-call-check': {
                build: false
            },
            'npm:babel-runtime@5.5.8/helpers/create-class': {
                build: false
            },
            'angular-formly': {
                build: false
            },
            d2: {
                build: false
            },
            babel: {
                build: false
            },
            angular: {
                build: false
            },
            'angular-animate': {
                build: false
            }
        },
        map: {
            "d2-angular/angular": "angular",
            "angular-animate.js": "angular-animate",
            "angular-mocks": "angular-mocks",
            "jquery": "jquery",
            "angular": {
                "process": "github:jspm/nodelibs-process@0.1.1"
            },
            "babel": "npm:babel-core@5.5.8"
        }
    });

    var sfxPromise = builder.buildSFX('d2.angular', 'build/d2-angular-sfx.js', {runtime: false})
        .then(function (output) {
            console.log('Modules included in normal systemjs bundle:')
            output.modules.forEach(function (name) {
                console.log('  - ' +name);
            });
            console.log('');
        })
        .catch(function (error) {
            console.log(error);
        });

    var normalPromise = builder.build('d2.angular', 'build/d2-angular.js', {runtime: false})
        .then(function (output) {
            console.log('Modules included in normal systemjs bundle:')
            output.modules.forEach(function (name) {
                console.log('  - ' +name);
            });
            console.log('');
        })
        .catch(function (error) {
            console.log(error);
        });

    whenAll([sfxPromise, normalPromise])
        .then(function () {
            console.log('Build complete');
            cb();
        });
    //})
    //.catch(function (e) {
    //    console.log('Unable to load config.js', e);
    //});
});

gulp.task('build-sass', function () {
    return gulp.src(['./src/**/*.scss'], {base: './src'})
        .pipe(gulp.dest(buildDirectory + '/scss'));
});

gulp.task('build-css', ['build-sass'], function () {
    return $.rubySass(['./src/d2-angular.scss'], {loadPath: './src', style: 'expanded', compass: true})
        .on('error', function (err) {
            console.error('Error!', err.message);
        })
        //.pipe($.minifyCss())
        .pipe(gulp.dest(buildDirectory));
});

/***********************************************************************************************************************
 * Githooks
 */
gulp.task('git:pre-commit', function (cb) {
    var runSequence = require('run-sequence');

    //Gulp exists with 0 and for the pre-commit hook to fail we need to exit with a not 0 error code
    gulp.on('err', function (e) {
        console.log('Pre-commit validate failed');
        process.exit(1);
    });

    runSequence('test', 'jshint', 'jscs', cb);
});

/***********************************************************************************************************************
 * Document tasks
 */

gulp.task('docs:clean', function (cb) {
    var del = require('del');
    del(docsDirectory + '/build/**/*', cb);
});

gulp.task('docs', function (cb) {
    var runSequence = require('run-sequence');
    runSequence('docs:clean', ['docs:app', 'docs:deps', 'docs:copy-build', 'docs:images'], cb);
});

gulp.task('docs:watch', function () {
    gulp.watch(['src/**/*.js'], ['docs:copy-build-js']);
    gulp.watch(['src/**/*.scss'], ['docs:copy-build-css']);
    gulp.watch(['docs/app/**/*.*'], ['docs:app']);
});

gulp.task('docs:copy-build-js', ['build-js'], function () {
    return gulp.src([buildDirectory + '/**/*'], {base: './build'})
        .pipe(gulp.dest(docsDirectory + '/build'));
});

gulp.task('docs:copy-build-css', ['build-css'], function () {
    return gulp.src([buildDirectory + '/**/*'], {base: './build'})
        .pipe(gulp.dest(docsDirectory + '/build'));
});

gulp.task('docs:app', function () {
    return gulp.src([docsDirectory + '/app/**/*'], {base: './docs/app'})
        .pipe(gulp.dest(docsDirectory + '/build'));
});

gulp.task('docs:deps', function () {
    return gulp.src([
        'jspm_packages/github/**/*.js',
        'jspm_packages/github/**/*.css',
        'jspm_packages/npm/**/*.js',
        'jspm_packages/npm/**/*.css',
        'jspm_packages/*.js',
        'jspm_packages/*.map'
    ], {base: '.'})
        .pipe(gulp.dest(docsDirectory + '/build'));
});

gulp.task('docs:images', function () {
    return gulp.src('src/images/**/*.{jpg,png,gif}', {base: './src/images'})
        .pipe(gulp.dest(
            [docsDirectory, 'images'].join('/')
        ));
});

/***********************************************************************************************************************
 * Travis continuous integration tasks
 */

gulp.task('travis', function () {
    var runSequence = require('run-sequence');
    return runSequence('test', 'jshint', 'jscs');
});

function runKarma(watch) {
    var config = {
        configFile: 'test/karma.conf.js'
    };

    if (!watch) {
        watch = false;
    }

    if (watch === true) {
        config.action = 'watch';
    }

    return $.karma(config);
}
