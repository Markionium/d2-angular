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
                    "d2-angular/*": "src/*",
                    'babel/modules/*': 'babel-runtime/modules/*',
                },

                "map": {
                    "angular": "npm:angular@1.4.0",
                    "process": "github:jspm/nodelibs-process@0.1.1",
                    "angular-animate": "npm:angular-animate@1.4.0",
                    "angular-mocks": "npm:angular-mocks@1.4.0",
                    "babel": "npm:babel-core@5.5.6",
                    "babel-runtime": "npm:babel-runtime@5.5.6",
                    "core-js": "npm:core-js@0.9.15",
                    "jquery": "github:components/jquery@2.1.4",
                    "github:jspm/nodelibs-process@0.1.1": {
                        "process": "npm:process@0.10.1"
                    },
                    "npm:angular@1.4.0": {
                        "process": "github:jspm/nodelibs-process@0.1.1"
                    },
                    "npm:babel-runtime@5.5.6": {
                        "process": "github:jspm/nodelibs-process@0.1.1"
                    },
                    "npm:core-js@0.9.15": {
                        "fs": "github:jspm/nodelibs-fs@0.1.2",
                        "process": "github:jspm/nodelibs-process@0.1.1",
                        "systemjs-json": "github:systemjs/plugin-json@0.1.0"
                    }
                }
            },

            files: [
                //Dependency files
                'jspm_packages/npm/**/*',
                'jspm_packages/npm/**/*.js',
                'jspm_packages/npm/**/*.css',
                'jspm_packages/github/**/*.js',

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
