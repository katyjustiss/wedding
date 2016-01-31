var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var deploy      = require('gulp-gh-pages');
var $ = require('gulp-load-plugins')({
      pattern: ['gulp-*', 'del', 'main-bower-files']
    });

///////////BABEL//////////////////
gulp.task('js:dev', function () {
  return gulp
    .src(['src/**/*.js', 'src/*.js', 'src/**/**/*.js'])
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('public'));
});

// gulp.task('js:prod', function () {
//   return gulp
//     .src(['src/**/*.js', 'src/*.js', 'src/**/**/*.js'])
//     .pipe($.sourcemaps.init())
//     .pipe($.babel())
//     .pipe($.uglify())
//     .pipe($.sourcemaps.write('.'))
//     .pipe(gulp.dest('public'))
// });

//////////////BOWER///////////////
gulp.task('bower', function () {
  return gulp
    .src($.mainBowerFiles('**/*.js'))
    .pipe($.concat('build.js'))
    .pipe(gulp.dest('public/lib'))
});

gulp.task('bower:css', function () {
  return gulp
    .src($.mainBowerFiles('**/*.css'))
    .pipe($.concat('build.css'))
    .pipe(gulp.dest('public/lib'))
});

/////////////CLEAN//////////////////
gulp.task('clean', function () {
   $.del('./public')
});

gulp.task('copy', function () {
  gulp
    .src('src/images/**')
    .pipe(gulp.dest('public/images'))
    .pipe(browserSync.stream())
  gulp
    .src('src/CNAME')
    .pipe(gulp.dest('public'));
});

/////////////DEPLOY/////////////////
gulp.task('deploy', function () {
  return gulp
    .src("public/**/**")
    .pipe(deploy())
});

///////////////SASS///////////////////
gulp.task('sass:dev', function () {
  return gulp
    .src('src/**/main.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.sourcemaps.write())
    .pipe($.autoprefixer('last 2 version'))
    .pipe(gulp.dest('public'))
    .pipe(browserSync.stream())
});

// gulp.task('sass:prod', function () {
//   return gulp
//     .src('src/**/main.scss')
//     .pipe($.sass({
//         outputStyle: 'compressed'
//       })
//       .on('error', $.sass.logError)
//     )
//     .pipe($.autoprefixer('last 2 version'))
//     .pipe(gulp.dest('public'))
// });

gulp.task('build', ['copy', 'sass:dev', 'js:dev', 'bower', 'bower:css'])

gulp.task('build:prod', ['copy', 'sass:prod', 'js:prod', 'bower'])
//may need a compress or uglify

gulp.task('browser-sync', function() {
    browserSync.init({
      server: {
          baseDir: "./"
      }
    });
});

//SERVER AND WATCH
gulp.task('serve', ['build'], function () {
  gulp.start('browser-sync');
  gulp.watch(['/html', './*.html']).on('change', browserSync.reload)
  gulp.watch(['src/**/*.scss', 'src/**/**/*.scss'], ['sass:dev']).on('change', browserSync.reload)
  gulp.watch(['src/**/*.js', 'src/**/**/*.js'], ['js:dev']).on('change', browserSync.reload)
});

gulp.task('default', ['clean'], function() {});
