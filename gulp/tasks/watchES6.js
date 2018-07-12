import gulp from "gulp";
import watch from "gulp-watch";
import eslint from "gulp-eslint";
import concat from "gulp-concat";
import sourcemaps from "gulp-sourcemaps";
import gulpWebpack from "webpack-stream";
import webpack from "webpack";

import login from "./login";
import config from "../config";
import fileActionResolver from "../util/fileActionResolver";
const bypass = true;
gulp.task("watch-es6", ["login"], () => {
  var conf = config.es6;
  return watch(conf.path, function(file) {
    var stream = gulp
      .src(file.path)
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(
        eslint.results(results => {
          // Called once for all ESLint results.
          if (bypass) {
            console.log("No lint errors".green);
            fileActionResolver(file);
          } else {
            console.log(
              "Please fix errors before uploading or set esLintUploadOnError:true"
                .yellow
            );
          }
        })
      )
      .pipe(
        gulpWebpack({ config: require("../../webpack.config.js") }, webpack)
      )
      .pipe(gulp.dest("../<deleted>/scripts"));

    return stream;
  });
});

gulp.task("es6-watch", ["login"], function() {
  global.isWatching = true;
  gulp.run("watch-es6");
});
