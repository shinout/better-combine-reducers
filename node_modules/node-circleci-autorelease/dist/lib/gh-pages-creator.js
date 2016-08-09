'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _shelljs = require('shelljs');

var _exec2 = require('../util/exec');

var _exec3 = _interopRequireDefault(_exec2);

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Creator for gh-pages
 */

var GhPagesCreator = function () {
    function GhPagesCreator() {
        _classCallCheck(this, GhPagesCreator);
    }

    _createClass(GhPagesCreator, [{
        key: 'create',


        /**
         * @public
         */
        value: function create(dir) {
            var _this = this;

            var remote = arguments.length <= 1 || arguments[1] === undefined ? 'origin' : arguments[1];


            this.exec('git checkout --orphan gh-pages');

            if (dir) {

                this.exec('git reset');
                this.exec('git add -f ' + dir);
                this.exec('git clean -fdx');

                (0, _shelljs.ls)(dir).forEach(function (file) {
                    _this.exec('git mv ' + dir + '/' + file + ' .');
                });
            }
            this.addCircleYml();

            this.exec('git commit -m "gh-pages"');
            this.exec('git push --force ' + remote + ' gh-pages');
        }

        /**
         * Add circle.yml for gh-pages
         * @private
         */

    }, {
        key: 'addCircleYml',
        value: function addCircleYml() {
            var ignoreGhPagesYml = {
                general: { branches: { ignore: ['gh-pages'] } }
            };
            var ymlStr = _jsYaml2.default.dump(ignoreGhPagesYml, { indent: 2, lineWidth: 120 });
            this.write('circle.yml', ymlStr);
            this.exec('git add -f circle.yml');
        }

        /**
         * Write a file with the content
         * @private
         */

    }, {
        key: 'write',
        value: function write(filename, content) {
            _fs2.default.writeFileSync(process.cwd() + '/' + filename, content);
        }

        /**
         * execute a given command
         * @private
         */

    }, {
        key: 'exec',
        value: function exec() {
            return _exec3.default.apply(undefined, arguments);
        }
    }]);

    return GhPagesCreator;
}();

exports.default = GhPagesCreator;