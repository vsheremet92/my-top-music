const gulp = require('gulp');
const sass = require('gulp-sass');
const browserify = require("browserify");
const bsync = require('browser-sync');
const htmlhint = require("gulp-htmlhint");
const ts = require('gulp-typescript');
const plumber = require('gulp-plumber');
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

gulp.task('watch', ['browserify-compile', 'sass', 'html'], ()=> {
    gulp.watch('client/components/**/*.tsx', ['browserify-compile']);
    gulp.watch('client/styles/**/*.scss', ['sass']);
    gulp.watch('client/html/**/*.html', ['html']);
})

gulp.task('bsync', ['watch'], ()=> {
    bsync({
        server: {
            baseDir: path.build.base
        }
    })
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

const clientTs = ts.createProject('./client/tsconfig.json');
function compileClientTs() {
  let tsResult = clientTs.src()
      .pipe(plumber())
      .pipe(clientTs());
  return tsResult.js
      .pipe(plumber())
      .pipe(gulp.dest('client/obj/js'))
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

gulp.task('default', ['bsync']);
