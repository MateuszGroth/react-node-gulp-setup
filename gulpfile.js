const gulp = require("gulp");
const bSync = require("browser-sync");
const sass = require("gulp-sass");
const sourceMaps = require("gulp-sourcemaps");
const autoPrefixer = require("gulp-autoprefixer");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const browserify = require("browserify");
const source = require("vinyl-source-stream");
const streamify = require("gulp-streamify");

//browserify for transpiling "imports"
function reload(done) {
  bSync.reload();
  done();
}

gulp.task("compile-js", async () => {
  const stream = gulp
    .src(["./src/**/*.js", "./src/**/*.jsx"])
    .pipe(
      babel({
        presets: [
          [
            "@babel/preset-env",
            {
              useBuiltIns: "usage",
              corejs: "2"
            }
          ],
          "@babel/preset-react"
        ]
      })
    )
    .pipe(gulp.dest("./tmp"));

  await new Promise((resolve, reject) => {
    stream.on("end", async function() {
      await bundle();
      resolve();
    });
  });

  return stream;
});

async function bundle() {
  const stream = await browserify({
    entries: "./tmp/index.js",
    debug: true
  })
    .bundle()
    .pipe(source("bundle.js"))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest("./public"));

  return new Promise(resolve => {
    stream.on("end", function() {
      resolve();
    });
  });
}

gulp.task("sass", () => {
  return gulp
    .src("./src/style/**/*.scss")
    .pipe(sourceMaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(autoPrefixer())
    .pipe(sourceMaps.write())
    .pipe(gulp.dest("./public/style"))
    .pipe(bSync.stream());
});

gulp.task("serve", () => {
  bSync({
    // port: 3001,
    proxy: "localhost:3000"
  });

  gulp.watch("./public/**/*.js", gulp.series(reload));
  gulp.watch("./views/**/*.ejs", gulp.series(reload));
  gulp.watch(["./src/**/*.js", "./src/**/*.jsx"], gulp.series("compile-js"));
  gulp.watch("./src/style/**/*.scss", gulp.series("sass"));
});

gulp.task("default", gulp.parallel("serve"), done => {
  done();
});
