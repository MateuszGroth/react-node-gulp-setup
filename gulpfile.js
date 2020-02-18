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

const entryFiles = [
  { folder: "login", fileName: "index.js" },
  { folder: "home", fileName: "index.js" }
];

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
      for (let i = 0; i < entryFiles.length; i++) {
        await bundle(entryFiles[i]);
      }
      resolve();
    });
  });

  return stream;
});

async function bundle(entryFileObj) {
  const stream = await browserify({
    entries: `./tmp/${entryFileObj.folder}/${entryFileObj.fileName}`,
    debug: true
  })
    .bundle()
    .pipe(source(`./${entryFileObj.folder}/${entryFileObj.fileName}`))
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
    .src("./src/**/*.scss")
    .pipe(sourceMaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(autoPrefixer())
    .pipe(sourceMaps.write())
    .pipe(gulp.dest("./public"))
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
