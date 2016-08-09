'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Getting current working directory
 *
 */

var WorkingDirectory = function () {
    function WorkingDirectory() {
        _classCallCheck(this, WorkingDirectory);

        this.path = process.cwd();
    }

    /**
     * get current project root
     * @public
     */


    _createClass(WorkingDirectory, [{
        key: 'resolve',
        value: function resolve() {
            if (this.inNodeModules() && this.upperPackageJSON()) {
                this.path = _path2.default.normalize(this.path + '/../..');
            }

            return this.path;
        }
    }, {
        key: 'inNodeModules',
        value: function inNodeModules() {

            return _path2.default.basename(_path2.default.normalize(this.path + '/..')) === 'node_modules';
        }
    }, {
        key: 'upperPackageJSON',
        value: function upperPackageJSON() {

            var upperPackagePath = _path2.default.normalize(this.path + '/../../package.json');

            return _fs2.default.existsSync(upperPackagePath);
        }
    }]);

    return WorkingDirectory;
}();

exports.default = WorkingDirectory;