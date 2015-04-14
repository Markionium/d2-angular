System.meta = {};
System.meta['d2'] = {
  build: false
};
System.meta['angular'] = {
  build: false
};
System.meta['angular-animate'] = {
  build: false
};

System.config({
  "baseURL": ".",
  "transpiler": "babel",
  "paths": {
    "*": "*.js",
    "github:*": "jspm_packages/github/*.js",
    "npm:*": "jspm_packages/npm/*.js",
    "d2-angular/*": "*.js",
    "d2": "jspm_packages/npm/d2/*.js"
  }
});

System.config({
  "map": {
    "d2.angular": "d2.angular"
  }
});
