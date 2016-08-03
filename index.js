/**
 * @file index.js
 * @author leeight
 */

var through = require('through2');
var gutil = require('gulp-util');
var babel = require('babel');
var assign = require('object-assign');

module.exports = function (options) {
    var compileOptions = assign({
        loose: 'all',
        modules: 'amd',
        compact: false,
        ast: false,
        blacklist: ['strict']
    }, options);

    function main(file, enc, callback) {
        if (file.isNull() || file.isStream()) {
            callback(null, file);
            return;
        }

        try {
            var result = babel.transform(file.contents, compileOptions);

            file.contents = new Buffer(result.code);
            file.path = gutil.replaceExtension(file.path, '.js');

            callback(null, file);
        }
        catch (ex) {
            callback(ex, file);
        }
    }

    return through.obj(main);
};
