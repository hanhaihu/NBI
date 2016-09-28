var gulp = require('gulp'),
    clean = require('gulp-clean'),
    runSequence = require('run-sequence'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    collector = require('gulp-rev-collector'),
    concat = require('gulp-concat'),
    rev = require('gulp-rev'),
    notify = require('gulp-notify'),
    gutil = require('gulp-util'),
    fs = require('fs'),
    transport = require('gulp-cmd-transit'),
    minifyCSS = require('gulp-minify-css'),
    usemin = require('gulp-usemin');

var dist = 'dest';

gulp.task('jst.html', function() {
    var rx_escapable = /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        meta = { // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"': '\\"',
            '\\': '\\\\'
        },

        quote = function(string) {
            // If the string contains no control characters, no quote characters, and no
            // backslash characters, then we can safely slap some quotes around it.
            // Otherwise we must also replace the offending characters with safe escape
            // sequences.
            rx_escapable.lastIndex = 0;
            if (rx_escapable.test(string)) {
                return '"' + string.replace(rx_escapable, function(a) {
                    var c = meta[a];
                    if (typeof c === 'string') {
                        return c;
                    } else {
                        return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                    }
                }) + '"';
            } else {
                return '"' + string + '"';
            }
        };

    function unixy(uri) {
        return uri.replace(/\\/g, '/');
    }


    var parser = function(filename, file) {
        var content = [
            'define(function(require, exports, module) {',
            '    module.exports=' + quote(file).replace(/\s+/g, ' ') + ';',
            '});'
        ].join('\n');
        fs.writeFileSync(filename + '.js', content, 'utf-8');
    };

    var handle = function(dir) {
        var files = fs.readdirSync(dir);
        if (!files || !files.length) return;

        files.forEach(function(filename) {
            var path = dir + '/' + filename;
            var stats = fs.statSync(path);

            if (stats.isFile()) {
                if (/\.html$/.test(filename)) {
                    return parser(path, fs.readFileSync(path, 'utf-8'));
                }
            }

            if (stats.isDirectory()) {
                handle(path);
            }
        });
    };

    handle('dest/pages');
    handle('dest/js');
});

// 清除发布目录
gulp.task('clean', function() {
    return gulp
        .src(dist)
        .pipe(clean());
});

// sass css
gulp.task('sass', function() {
    return gulp.src('src/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(dist + '/css/'));
});

// 实时监听文件修改
gulp.task('watch', function(cb) {
    gulp.watch('src/**/*', function() {
        runSequence(['copy', 'jst.html', 'sass'], function() {
            gutil.log('watch triggered');
        });
    });

    cb();
});

//从src复制文件到dest

gulp.task('copy', function() {
    return gulp.src(['src/!(sass)*/**', 'src/*.html', 'src/*.jsp', 'src/*.js'], {
            'base': 'src'
        })
        .pipe(gulp.dest('dest/'));
});



/*
 * @desc Transport JS
 */

gulp.task("transport", function() {
    return gulp.src([
            'dest/resources/**/*.js',
        ], {
            'base': 'dest'
        })
        .pipe(transport({
            dealIdCallback: function(id) {
                return './' + id;
            }
        }))
        .pipe(gulp.dest('dest/'));
});


/**
 * 文件md5戳处理
 */
gulp.task('md5', function() {

    return gulp.src(['dest/js/**/*.js', 'dest/css/**/*.css', 'dest/pages/**/*.*', '!dest/plugins/**/*.*'], {

            base: 'dest'
        })
        .pipe(rev())
        .pipe(gulp.dest('dest/'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('dest/rev/module'));
});


/**
 *替换带有MD5戳的文件
 */

gulp.task('collector', function() {
    return gulp.src(['dest/rev/**/*.json', 'dest/*.html', 'dest/*.jsp', 'dest/resources.js'])
        .pipe(collector({
            replaceReved: true
        }))
        .pipe(gulp.dest('dest/'));
});



function rev2map() {
    var map = [];
    var manifest = require('./dest/rev/module/rev-manifest.json');
    if (manifest) {
        for (var key in manifest) {
            map.push([key, manifest[key]]);
        }
    }
    return map;
}

/**
 * 更改seajs的map配置，映射带md5戳的文件
 */
gulp.task('seajs:map', function() {
    var map = rev2map();
    var dir = 'dest/js/home/';
    var files = fs.readdirSync(dir);
    files.forEach(function(file) {
        var filename = dir + '/' + file;
        var data = fs.readFileSync(filename, 'utf-8');
        data = data.replace(/map\:\s*(\[\s*\/\*\$\{gulp\-replace\}\*\/\s*\])/gi, 'map:' + JSON.stringify(map));
        fs.writeFileSync(filename, data, 'utf-8');
    });
});


/**
 * Replaces references to non-optimized scripts or stylesheets into a set of HTML files (or any templates/views).
 */

gulp.task('usemin', function() {
    return gulp.src(['dest/*.jsp', 'dest/*.html'])
        .pipe(usemin({
            common: ['concat'],
            app: ['concat']
        }))
        .pipe(gulp.dest('dest/'));
});



/**
 *  minifyCss
 */


gulp.task('minify-css', function() {
    return gulp.src(['dest/css/**/*.css'])
        .pipe(minifyCSS({
            keepSpecialComments: false
        }))
        .pipe(gulp.dest('dest/css/'));
});



/**
 *清除中间文件
 */

gulp.task('clean:temp', function() {

    gulp.src(['dest/plugins/multiple-select.png']) //解决图片引起的问题
        .pipe(gulp.dest('dest/css/home/'));
    return gulp.src(['dest/rev', 'dest/index.html'])
        .pipe(clean());
});



// 发布打包
gulp.task('build', function() {
    runSequence('clean', 'copy', 'jst.html', 'sass', 'transport', 'usemin', 'md5', 'seajs:map', 'collector', 'minify-css', 'clean:temp');
});

// 开发打包
gulp.task('dev', function() {
    runSequence('clean', 'copy', 'jst.html', 'sass', 'watch');
});


gulp.task('default', function() {
    console.log('usage:\n\t `> gulp dev` 开发[实时监听文件修改，并同步到dist目录]');
    console.log('\t `> gulp build` 打包[打包生成到dist目录]');
});