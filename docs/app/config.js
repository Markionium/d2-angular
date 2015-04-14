System.config({
    "baseURL": ".",
    "transpiler": "babel",
    "babelOptions": {
        "optional": [
            "runtime"
        ]
    },
    "paths": {
        "*": "*.js",
        "github:*": "jspm_packages/github/*.js",
        "npm:*": "jspm_packages/npm/*.js",
        "d2-angular/*": "d2-angular/*.js",
        "d2": "jspm_packages/npm/d2/*.js"
    }
});

System.config({
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
});

