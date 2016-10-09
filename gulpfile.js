var gulp = require('gulp');
var watch = require('gulp-watch');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var rigger = require('gulp-rigger');
var cleanCss = require('gulp-clean-css');
var imagemin    = require('gulp-imagemin');
var pngquant    = require('imagemin-pngquant');
var cache       = require('gulp-cache');
var spritesmith = require('gulp.spritesmith');
var rimraf      = require('rimraf');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var plumber = require('gulp-plumber');
var prefixer = require('gulp-autoprefixer');

//пути
var patch = {

	build: {
		html: 'build/',
        js: 'build/js',
        css: 'build/css',
        img: 'build/img',
        fonts: 'build/fonts',
        spritesImg: 'build/img/sprite',
        spritesSCSS: 'src/style/partials'
	},

	src: {
		 html: 'src/*.html',
        js: 'src/js/main.js',
        style: 'src/style/main.scss',
        img: 'src/style/img/**/*.*',
        fonts: 'src/fonts/**/*.*',
        sprites: 'src/style/sprite/*.*'
	},

	watch: {
		html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/style/**/*.scss',
        img: 'src/style/img/**/*.*',
        fonts: 'src/fonts/**/*.*',
        sprites: 'src/style/sprite/*.*'
	},
	clean: './build'
};







gulp.task('webserver', function() {
	browserSync({
		server: {
			baseDir:"./build"
		},
		host: 'localhost',
		port: 3000,
		tunnel: true
		});
});

gulp.task('html:build', function() {
	gulp.src(patch.src.html)
		.pipe(rigger())
		.pipe(gulp.dest(patch.build.html))
		.pipe(reload({stream:true}));
});

gulp.task('js:build', function() {
	gulp.src(patch.src.js)
		.pipe(plumber())
		.pipe(rigger())
		.pipe(uglify())
		.pipe(gulp.dest(patch.build.js))
		.pipe(reload({stream:true}));
});

gulp.task('style:build', function() {
	gulp.src(patch.src.style)
		.pipe(plumber())
		.pipe(rigger())
		.pipe(sass())
		.pipe(prefixer())
		.pipe(cleanCss())
		.pipe(gulp.dest(patch.build.css))
		.pipe(reload({stream:true}));
});



gulp.task('sprite:build', function() {
    var spriteData =
        gulp.src(path.src.sprites)
    .pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.scss',
        imgPath: '../img/sprite/sprite.png',
    }));

    spriteData.img.pipe(gulp.dest(path.build.spritesImg)); // путь, куда сохраняем картинку
    spriteData.css.pipe(gulp.dest(path.build.spritesSCSS)); // путь, куда сохраняем стили
});

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});


gulp.task('build', [
	'html:build',
	'js:build',
	'style:build',

	]);

gulp.task('watch', function(){
	watch([patch.watch.js], function(ev, callback) {
		gulp.start('js:build');
		});
	watch([patch.watch.html], function(ev, callback) {
		gulp.start('html:build');
		});
	watch([patch.watch.style], function(ev, callback) {
		gulp.start('style:build');
		});

        watch([path.watch.sprites], function(ev, callback) {
        gulp.start('sprite:build');
    });
	});

gulp.task('clean', function(cb) {
    rimraf(path.clean, cb);
});

gulp.task('clear', function() {
    return cache.clearAll();
});

gulp.task('default', ['build', 'webserver', 'watch'])

