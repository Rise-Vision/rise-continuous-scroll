/* jshint node: true */

(function () {
  "use strict";

  var bump = require("gulp-bump");
  var factory = require("widget-tester").gulpTaskFactory;
  var gulp = require("gulp");
  var path = require("path");
  var rimraf = require("rimraf");
  var runSequence = require("run-sequence");
  var wct = require("web-component-tester").gulp.init(gulp);
  var webpackStream = require("webpack-stream");

  gulp.task("bump", function() {
    return gulp.src(["./package.json", "./bower.json"])
      .pipe(bump({ type: "patch" }))
      .pipe(gulp.dest("./"));
  });

  gulp.task("clean", function (cb) {
    rimraf("./dist/**", cb);
  });

  gulp.task("src", function() {
    return gulp.src("src/continuous-scroll.js")
      .pipe(webpackStream(require("./webpack.config.js")))
      .pipe(gulp.dest("dist/"));
  });

  // ****** Testing ***** //
  gulp.task("test:integration:src", function() {
    return gulp.src("test/integration/widget.js")
      .pipe(webpackStream(require("./webpack.test.config.js")))
      .pipe(gulp.dest("test/integration"));
  });

  gulp.task("test:integration", function(cb) {
    runSequence(["test:integration:src"], "test:local", cb);
  });

  gulp.task("test:unit", factory.testUnitReact(
    { configFile: path.join(__dirname, "test/react-karma.conf.js") }
  ));

  gulp.task("test", function(cb) {
    runSequence("test:integration", "test:unit", cb);
  });

  gulp.task("build", function (cb) {
    runSequence(["clean"], ["src"], cb);
  });

})();
