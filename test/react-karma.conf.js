var path = require("path");
var webpackConfig = require("../webpack.config.js");
webpackConfig.devtool = "inline-source-map";

module.exports = function(config) {
  config.set({

    autoWatch : false,

    frameworks: ["mocha", "chai", "chai-as-promised", "sinon-chai"],

    browsers : ["PhantomJS"],

    files: ["unit/test-index.js"],

    preprocessors : {
      "unit/test-index.js": [ "webpack"]
    },

    webpack: webpackConfig,

    reporters: ["progress", "junit", "coverage"],

    plugins : [
      "karma-mocha",
      "karma-chai",
      "sinon-chai",
      "karma-junit-reporter",
      "karma-coverage",
      "karma-chai-plugins",
      "karma-phantomjs-launcher",
      "karma-webpack"
    ],

    junitReporter : {
      outputFile: path.join(__dirname, "../reports/react-karma-xunit.xml")
    },

    coverageReporter: {
      type : "cobertura",
      dir : path.join(__dirname, "../reports/react-coverage")
    },

    port: 9876,

    logLevel: config.LOG_INFO,

    colors: true

  });
};
