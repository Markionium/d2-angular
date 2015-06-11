module.exports = function( config ) {
    config.set({
        basePath: '../',

        //Frameworks to use with karma
        frameworks: ['mocha', 'chai', 'sinon-chai', 'sinon', 'systemjs'],

        //How will the results of the tests be reported
        reporters: ['mocha'],

        //Files that should be included by karma (that are not served by karma-systemjs)
        files: [
            'jspm_packages/github/components/jquery@*/jquery.js',
            './test/fixtures/**/*.js',
        ],

        //Config for karma-systemjs
        systemjs: {
            configFile: './config.js',
            config: {
                baseURL: '/',
                transpiler: 'babel',
                "babelOptions": {
                    "optional": [
                        "runtime"
                    ]
                },

                paths: {
                    "github:*": "jspm_packages/github/*",
                    "npm:*": "jspm_packages/npm/*",
                    "d2-angular/*": "src/*"
                },

                "map": {
                    "process": "github:jspm/nodelibs-process@0.1.1"
                }
            },

            files: [
                //Dependency files
                'jspm_packages/npm/*.js',
                'jspm_packages/npm/*/*.js',
                'jspm_packages/npm/*/dist/*.js',
                'jspm_packages/npm/**/*.css',
                'jspm_packages/github/**/*.js',
                'jspm_packages/npm/*/!(src)/**', // angular-formly and api-check include their source files and they bug out with the loader. Therefore ignore any /src/ maps.

                //App source files
                'src/**/*.js',

                //Test files
                'test/mocks/**/*.js',
                'test/**/*_spec.js'
            ]
        },

        logLevel: config.LOG_INFO,

        browsers: ['PhantomJS'],
        singleRun: true
    });
};
