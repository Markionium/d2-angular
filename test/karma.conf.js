module.exports = function( config ) {
    config.set({
        basePath: '../',
        frameworks: ['mocha', 'chai', 'sinon-chai', 'sinon', 'systemjs'],

        plugins: ['karma-systemjs', 'karma-mocha', 'karma-chai', 'karma-sinon', 'karma-sinon-chai', 'karma-phantomjs-launcher', 'karma-chrome-launcher'],

        preprocessors: {
            //'./test/specs/**/*_spec.js': ['babel'],
            //'./src/**/*.js': ['babel']
        },

        files: [
            './test/fixtures/**/*.js',
            './jspm_packages/github/components/jquery@2.1.3/jquery.js',
            {pattern: './test/**/*_spec.js', included: false, watched: true},
            {pattern: './dhis/api/schemas', included: false, watched: true}
        ],

        reporters: ['progress'],

        'babelPreprocessor': {
            options: {
                modules: 'common',
                sourceMap: 'inline'
            },
            filename: function(file) {
                console.log('Babelifying: ' + file.originalPath);
            },
            sourceFileName: function(file) {
                return file.originalPath;
            }
        },

        coverageReporter: {
            type: 'lcov',
            dir: '../coverage',
            subdir: function(browser) {
                // Normalization process to keep a consistent browser name accross different OS
                return browser.toLowerCase().split(/[ /-]/)[0];
            }
        },

        systemjs: {
            configFile: './config.js',
            files: [
                './test/mocks/d2-angular.js',
                './jspm_packages/npm/d2/d2.js',
                './jspm_packages/github/components/jquery@2.1.3.js',
                './jspm_packages/github/components/jquery@2.1.3/jquery.js',
                './jspm_packages/github/angular/bower-angular@1.3.14.js',
                './jspm_packages/github/angular/bower-angular@1.3.14/angular.js',
                './jspm_packages/github/angular/bower-angular-mocks@1.3.14.js',
                './jspm_packages/github/angular/bower-angular-mocks@1.3.14/angular-mocks.js',
                './src/**/*.js',

                './test/specs/**/*_spec.js'
            ],

            config: {
                baseURL: '/',
                transpiler: 'babel',
                paths: {
                    'jquery': './jspm_packages/github/components/jquery@2.1.3/jquery.js',
                    'angular': './jspm_packages/github/angular/bower-angular@1.3.14/angular.js',
                    'angular-mocks': './jspm_packages/github/angular/bower-angular-mocks@1.3.14/angular-mocks.js',
                    'd2.angular': './test/mocks/d2-angular.js'
                }
            },

            testFileSuffix: '_spec.js'
        },

        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,

        autoWatch: true,
        autoWatchBatchDelay: 100,
        usePolling: true,

        browsers: [/*'PhantomJS'*/, 'Chrome'],
        singleRun: true
    });
};
