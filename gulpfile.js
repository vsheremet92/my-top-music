const gulp = require('gulp');
const sass = require('gulp-sass');
const browserify = require("browserify");
const bsync = require('browser-sync').create();
const htmlhint = require("gulp-htmlhint");
const ts = require('gulp-typescript');
const plumber = require('gulp-plumber');
const nodemon = require('nodemon');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const concat = require("gulp-concat");
const uglify = require('gulp-uglify-es').default;
const gutil = require('gulp-util');

const path = {
    base: 'client',
    src: 'client/html',
    html: 'client/html/**/*.html',
    styles: 'client/styles/index.scss',
    stylesAll: 'client/styles',
    build: {
        base: 'client/build',
        css: 'client/build/css',
        js: 'client/build/js/index.js'
    }
}

gulp.task('sass', ()=> {
    return gulp.src(path.styles)
    .pipe(sass())
    .pipe(gulp.dest(path.build.css))
    .pipe(bsync.reload({stream: true}))
})

gulp.task('watch', ['ts-compile-server', 'sass', 'html', 'browserify-compile'], ()=> {
    gulp.watch('server/source/**/*.ts', ['ts-compile-server']);
    gulp.watch('client/components/**/*.tsx', ['browserify-compile']);
    gulp.watch('client/styles/**/*.scss', ['sass']);
    gulp.watch('client/html/**/*.html', ['html']);
})

gulp.task('bsync', ['serve'], ()=> {
    bsync.init(null, {
		      proxy: "http://localhost:5000",
          files: ["client/build/*/*.*"],
          port: 7000
      });
})

gulp.task('html', compileHtml);

function compileHtml() {
    return gulp.src(path.html)
        .pipe(htmlhint())
        .pipe(htmlhint.reporter())
        .pipe(gulp.dest(path.build.base))
        .pipe(bsync.reload({stream: true}))
}

gulp.task("ts-compile-client", compileClientTs);
gulp.task('ts-compile-server', compileServerTs);

const clientTs = ts.createProject('./client/tsconfig.json');
function compileClientTs() {
  let tsResult = clientTs.src()
      .pipe(plumber())
      .pipe(clientTs());
  return tsResult.js
      .pipe(plumber())
      .pipe(gulp.dest('client/obj/js'))
}

const serverTs = ts.createProject(`./server/tsconfig.json`);
function compileServerTs() {
    let tsResult = serverTs.src()
        .pipe(plumber())
        .pipe(serverTs());
    return tsResult.js
        .pipe(plumber())
        .pipe(gulp.dest(`server/build`))
        .pipe(bsync.reload({stream: true}))
}

const browserifyInstance = browserify({
        basedir: ".",
        debug: true,
        entries: 'client/obj/js/index.js',
        cache: {},
        packageCache: {},
    })
    .on('update', browserifyClient);

gulp.task("browserify-compile", ["ts-compile-client"], browserifyClient);

function browserifyClient() {
    return browserifyInstance
        .bundle()
        .on('error', function(err) {
            console.error(err);
            this.emit('end');
        })
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(gulp.dest('client/build/js'))
        .pipe(bsync.reload({stream: true}))
}

gulp.task('serve', ['watch'], function() {
    nodemon({
        script: `server/build`,
        ext: 'js',
        args: process.argv.slice(3),
        ignore: ['client/**/*', 'node_modules/**/*', 'gulpfile.js'],
        env: {
            'NODE_ENV': 'development'
        }
    });
});

gulp.task('default', ['bsync']);
