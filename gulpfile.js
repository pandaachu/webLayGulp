var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

var browserSync = require('browser-sync').create();

sass.compiler = require('node-sass');

// html：
function copyHTML() {
    return gulp
        .src('./src/**/*.html') //原始碼路徑 (** --> 底下所有資料夾)
        .pipe(gulp.dest('./dist/'))
        .pipe(
            //每個任務後面都要加
            browserSync.reload({
                stream: true,
            })
        );
}

// scss+map：
function scss() {
    //scss 改這個名字會有衝突
    return gulp
        .src('./src/scss/**/*.scss')
        .pipe(sourcemaps.init()) //初始化目前的scss
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/css/'))
        .pipe(
            //每個任務後面都要加
            browserSync.reload({
                stream: true,
            })
        );
}

// browser-sync
function browser() {
    //browserSync 改這個名字會有衝突
    browserSync.init({
        server: {
            baseDir: './dist', //要模擬的路徑，在dist資料夾
        },
        port: 8080, // 指定瀏覽器的port號; http://localhost:8080/
    });
}

// 新增監聽
function watch(){
  gulp.watch('./src/**/*.html', gulp.series(copyHTML)) //監聽到這個'./src/**/*.html'底下的HTML有任何變化後依序執行
  gulp.watch('./src/scss/**/*.scss', gulp.series(scss)) 
}

//exports.default = gulp.series(copyHTML, scss ,browserSync); // 完成後依序執行
exports.default = gulp.series(copyHTML, scss, gulp.parallel(browser, watch)); 
// browserSyncm 一定要放在最後，所有東西都完成了才會渲染在瀏覽器
// gulp.parallel (browser, watch) browser, watch一定要同時執行
// 先執依序執行 copyHTML --> scss --> 再同時執行 (browser, watch)
