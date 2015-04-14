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
                    "d2-angular/*": "src/*.js"
                },

                "map": {
                    "angular": "github:angular/bower-angular@1.3.15",
                    "angular-animate": "npm:angular-animate@1.3.15",
                    "angular-aria": "npm:angular-aria@1.3.15",
                    "angular-material": "npm:angular-material@0.8.3",
                    "angular-mocks": "npm:angular-mocks@1.3.15",
                    "angular-route": "npm:angular-route@1.3.15",
                    "babel": "npm:babel@4.7.16",
                    "babel-runtime": "npm:babel-runtime@4.7.16",
                    "jquery": "github:components/jquery@2.1.3",
                    "github:jspm/nodelibs-process@0.1.1": {
                        "process": "npm:process@0.10.1"
                    },
                    "npm:angular-material@0.8.3": {
                        "angular": "npm:angular@1.3.15",
                        "angular-animate": "npm:angular-animate@1.3.15",
                        "angular-aria": "npm:angular-aria@1.3.15",
                        "process": "github:jspm/nodelibs-process@0.1.1"
                    },
                    "npm:angular@1.3.15": {
                        "process": "github:jspm/nodelibs-process@0.1.1"
                    },
                    "npm:babel-runtime@4.7.16": {
                        "process": "github:jspm/nodelibs-process@0.1.1"
                    }
                }
            },

            files: [
                //Dependency files
                'jspm_packages/npm/**/*.js',
                'jspm_packages/npm/**/*.css',
                'jspm_packages/github/**/*.js',
                'jspm_packages/github/**/*.css',

                //App source files
                'src/**/*.html',
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
