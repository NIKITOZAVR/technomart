var gulp      = require('gulp'), // Подключаем Gulp
 sass         = require('gulp-sass'), //Подключаем Sass пакет,
 browserSync  = require('browser-sync'), // Подключаем Browser Sync
 concat       = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
 concatCss    = require('gulp-concat-css'), // Слеплюет css, обычный concat для js.
 uglify       = require('gulp-uglifyjs'), // Подключаем gulp-uglifyjs (для сжатия JS)
 cssnano      = require('gulp-cssnano'), // Подключаем пакет для минификации CSS
 rename       = require('gulp-rename'), // Подключаем библиотеку для переименования файлов
 del          = require('del'), // Подключаем библиотеку для удаления файлов и папок
 imagemin     = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
 pngquant     = require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
 cache        = require('gulp-cache'), // Подключаем библиотеку кеширования
 autoprefixer = require('gulp-autoprefixer'),
 gutil        = require('gulp-util'),
 ftp          = require('gulp-ftp');


//----------------------------------------------WORKFLOW
gulp.task('sass', function(){ // Создаем таск Sass
 return gulp.src('src/sass/**/*.sass') // Берем источник
   .pipe(sass({outputStyle: 'expanded'})) // Преобразуем Sass в CSS посредством gulp-sass
   .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
  //  .pipe(rename('compiled.css'))
   .pipe(gulp.dest('src/css').on('error', sass.logError)) // Выгружаем результата в папку app/css
   .pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
});


gulp.task('browser-sync', function() { // Создаем таск browser-sync
 browserSync({ // Выполняем browserSync
   server: { // Определяем параметры сервера
     baseDir: 'src' // Директория для сервера - app
   },
   notify: false // Отключаем уведомления
 });
});

gulp.task('watch', ['browser-sync'], function() {
  gulp.watch('src/sass/**/*.sass', ['sass']); // Наблюдение за sass файлами в папке sass
  gulp.watch('src/*.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
  gulp.watch('src/js/**/*.js', browserSync.reload);   // Наблюдение за JS файлами в папке js
});






//----------------------------------------------BUILD
gulp.task('buildstyles', function() { //concat minify autoprefix
  return gulp.src(['src/css/icomoon.css', 'src/css/style.css', 'src/css/media.css']) // пишем главный файла в котором есть import, которые в момент concat подставлятся.
  .pipe(concatCss('main.css'))
  .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
  .pipe(cssnano())
  .pipe(gulp.dest('dist/css'));
})

gulp.task('buildscripts', function() {
 return gulp.src([ // Берем все необходимые библиотеки
   'src/js/libs/jquery-3.1.1.min.js', // Берем jQuery
   'src/js/libs/jcarousel.js',
   'src/js/libs/jquery.validate.min.js',
   'src/js/libs/jquery.inputmask.min.js',
   'src/js/script.js'
   ])
   .pipe(concat('main.js')) // Собираем их в кучу в новом файле libs.min.js
   .pipe(uglify()) // Сжимаем JS файл
   .pipe(gulp.dest('dist/js')); // Выгружаем в папку app/js
});

// gulp.task('css-libs', ['sass'], function() {
//  return gulp.src('app/css/libs.css') // Выбираем файл для минификации
//    .pipe(cssnano()) // Сжимаем
//    .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
//    .pipe(gulp.dest('app/css')); // Выгружаем в папку app/css
// });


// gulp.task('clean', function() {
//  return del.sync('dist'); // Удаляем папку dist перед сборкой
// });

// gulp.task('img', function() {
//  return gulp.src('app/img/**/*') // Берем все изображения из app
//    .pipe(cache(imagemin({  // Сжимаем их с наилучшими настройками с учетом кеширования
//      interlaced: true,
//      progressive: true,
//      svgoPlugins: [{removeViewBox: false}],
//      use: [pngquant()]
//    })))
//    .pipe(gulp.dest('dist/img')); // Выгружаем на продакшен
// });

gulp.task('build', ['buildscripts', 'buildstyles'], function() {

 // var buildCss = gulp.src([ // Переносим библиотеки в продакшен
 //   'src/css/main.css'
 //   ])
 // .pipe(gulp.dest('dist/css')); // уже перенесена

 var buildFonts = gulp.src('src/fonts/**/*') // Переносим шрифты в продакшен
 .pipe(gulp.dest('dist/fonts'));

 var buildImg = gulp.src('src/img/**/*') // Переносим шрифты в продакшен
 .pipe(gulp.dest('dist/img'));

 // var buildJs = gulp.src('src/js/**/*') // Переносим скрипты в продакшен
 // .pipe(gulp.dest('dist/js')); // уже перемещены

 var buildHtml = gulp.src('src/*.html') // Переносим HTML в продакшен
 .pipe(gulp.dest('dist'));

});

// gulp.task('clear', function (callback) {
//  return cache.clearAll();
// })

// gulp.task('default', ['watch']);




//--------------------------------TO FTP
// var gulp = require('gulp');
//
//
// gulp.task('default', function () {
//     return gulp.src('src/*')
//         .pipe(ftp({
//             host: 'website.com',
//             user: 'johndoe',
//             pass: '1234'
//         }))
//         // you need to have some kind of stream after gulp-ftp to make sure it's flushed
//         // this can be a gulp plugin, gulp.dest, or any kind of stream
//         // here we use a passthrough stream
//         .pipe(gutil.noop());
// });
