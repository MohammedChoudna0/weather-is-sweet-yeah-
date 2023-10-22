const {src , dest , watch , parallel} = require("gulp");
const sass = require("gulp-sass")(require('sass'));
const plumber = require("gulp-plumber");

//Imagenes 
const webp = require("gulp-webp");
const imagemin = require('gulp-imagemin');//optimizar imagenes
const avif = require('gulp-avif');
const cache = require('gulp-cache');

//Estilos 
const autoprefixer = require('autoprefixer');//Prefijos para compatibilidad
const sourcemaps = require('gulp-sourcemaps')//mapas de fuente 
const cssnano = require('cssnano'); //plugin optimiza y comprime tu CSS
const postcss    = require('gulp-postcss')//utiliza nano y autoprefixer

//JS
const concat = require('gulp-concat');//concatenar 
const terser = require('gulp-terser-js');//minificar js
const rename = require('gulp-rename');


const paths = {
    scss: 'src/scss/**/*.scss',
    js: 'src/js/**/*.js',
    imagenes: 'src/img/**/*'
};

function versionWebp(done) {
    const opciones = {quality : 50};
    src(paths.imagenes)
        .pipe( webp(opciones) )
        .pipe(dest('build/img'))
    done();
}
function versionAvif(done) {
    const opciones = {quality : 50};
    src(paths.imagenes)
        .pipe( avif(opciones) )
        .pipe(dest('build/img'))
    done();
}

function css(done) {
    src(paths.scss)
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(sass())
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest("build/css"))
    done();

}

function javascript(done) {
    src(paths.js)
      .pipe(sourcemaps.init())
      .pipe(concat('bundle.js')) // final output file name
      .pipe(terser())
      .pipe(sourcemaps.write('.'))
      .pipe(rename({ suffix: '.min' }))
      .pipe(dest('./build/js'))
    done();
}
function watchFiles(done) {
    watch( paths.scss, css );
    watch( paths.js, javascript );
    watch( paths.imagenes, imagenes );
    watch( paths.imagenes, versionWebp );
    done()
}

function imagenes(done) {
    src(paths.imagenes)
        .pipe(cache(imagemin({ optimizationLevel: 3})))
        .pipe(dest('build/img'))
    done();
}


exports.versionWebp = versionWebp;
exports.watchFiles = watchFiles;
exports.css = css;
exports.javascript = javascript;
exports.imagenes = imagenes;
exports.versionAvif = versionAvif;
exports.default = parallel(watchFiles, versionWebp , imagenes, versionAvif ,javascript); 
