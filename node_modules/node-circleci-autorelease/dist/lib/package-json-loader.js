'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Loader for package.json
 */

var PackageJSONLoader = function () {
    function PackageJSONLoader() {
        _classCallCheck(this, PackageJSONLoader);
    }

    _createClass(PackageJSONLoader, null, [{
        key: 'load',


        /**
         * load package.json of the given path
         * @param cwd project root dir
         */
        value: function load(cwd) {

            var path = cwd + '/package.json';

            if (!_fs2.default.existsSync(path)) {
                throw new Error(path + ' is not found.');
            }

            try {
                return JSON.parse(_fs2.default.readFileSync(path, 'utf8'));
            } catch (e) {
                throw new Error(path + ': parse error.\n' + e.message);
            }
        }
    }, {
        key: 'save',
        value: function save(cwd, content) {

            var path = cwd + '/package.json';

            return _fs2.default.writeFileSync(path, JSON.stringify(content, null, 2) + '\n');
        }
    }]);

    return PackageJSONLoader;
}();

exports.default = PackageJSONLoader;