System.config({
  "baseURL": "./",
  "transpiler": "babel",
  "babelOptions": {
    "optional": [
      "runtime"
    ]
  },
  "paths": {
    "*": "*.js",
    "github:*": "./jspm_packages/github/*.js",
    "npm:*": "./jspm_packages/npm/*.js"
  }
});

System.config({
  "map": {
    "angular": "npm:angular@1.3.15",
    "angular-animate": "npm:angular-animate@1.3.15",
    "angular-mocks": "npm:angular-mocks@1.3.15",
    "babel": "npm:babel@4.7.16",
    "babel-runtime": "npm:babel-runtime@4.7.16",
    "jquery": "github:components/jquery@2.1.3",
    "github:jspm/nodelibs-process@0.1.1": {
      "process": "npm:process@0.10.1"
    },
    "npm:angular@1.3.15": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:babel-runtime@4.7.16": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    }
  }
});

