'use strict'

const { series, src, dest } = require('gulp')
const sass = require('sass')
const autoprefixer = require('gulp-autoprefixer')
const cssmin = require('gulp-cssmin')
const through2 = require('through2')
const Fiber = require('fibers')
const replaceExt = require('replace-ext')

function compile() {
  return src('./src/*.scss')
    .pipe(
      through2.obj(function (file, enc, cb) {
        const result = sass.renderSync({ file: file.path, fiber: Fiber })
        file.contents = result.css
        file.path = replaceExt(file.path, '.css')

        if (file.stat) {
          file.stat.atime = file.stat.mtime = file.stat.ctime = new Date()
        }

        cb(null, file)
      })
    )
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['ie > 9', 'last 2 versions'],
        cascade: false
      })
    )
    .pipe(cssmin())
    .pipe(dest('./lib'))
}

function copyfont() {
  return src('./src/fonts/**').pipe(cssmin()).pipe(dest('./lib/fonts'))
}

exports.build = series(compile, copyfont)
