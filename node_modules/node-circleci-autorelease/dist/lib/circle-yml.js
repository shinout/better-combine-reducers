'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _deepmerge = require('deepmerge');

var _deepmerge2 = _interopRequireDefault(_deepmerge);

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Generator for circle.yml
 */

var CircleYml = function () {
    function CircleYml() {
        _classCallCheck(this, CircleYml);
    }

    _createClass(CircleYml, null, [{
        key: 'generate',


        /**
         * @public
         */
        value: function generate(arYml) {

            var standard = this.standard(arYml);
            var custom = arYml.circle;

            var merged = (0, _deepmerge2.default)(standard, custom);
            this.modifyPathEnv(merged, standard.machine.environment.PATH);
            return _jsYaml2.default.dump(merged, { indent: 2, lineWidth: 120 });
        }
    }, {
        key: 'modifyPathEnv',
        value: function modifyPathEnv(circleYml, standardPath) {
            var environment = circleYml.machine.environment;


            if (environment.PATH === standardPath) {
                return;
            }

            var standardPaths = standardPath.split(':');
            var paths = environment.PATH.split(':');

            standardPaths.filter(function (path) {
                return !(paths.indexOf(path) !== -1);
            }).forEach(function (path) {
                return paths.push(path);
            });
            environment.PATH = paths.join(':');
        }

        /**
         * @private
         */

    }, {
        key: 'standard',
        value: function standard(arYml) {
            return {
                general: {
                    branches: {
                        ignore: ['gh-pages', '/release.*/']
                    }
                },

                machine: {

                    environment: {
                        PATH: './node_modules/.bin:$PATH'
                    },

                    pre: ['git config --global user.name "' + arYml.config('git_user_name') + '"', 'git config --global user.email "' + arYml.config('git_user_email') + '"']
                },

                dependencies: {
                    post: flat(arYml.hooks('update_modules', 'pre'), this.updateModulesCommand(arYml.config('npm_update_depth')), arYml.hooks('update_modules', 'post'))
                },

                deployment: {
                    create_release_branch: {
                        branch: ['master'],
                        commands: flat(arYml.hooks('release', 'pre'), this.releaseCommand(arYml), arYml.hooks('release', 'post'), arYml.hooks('gh_pages', 'pre'), this.ghPagesCommand(arYml.config('create_gh_pages'), arYml.config('gh_pages_dir')), arYml.hooks('gh_pages', 'post'))
                    }
                }
            };
        }

        /**
         * generate command to update node_modules
         * @private
         */

    }, {
        key: 'updateModulesCommand',
        value: function updateModulesCommand(depth) {
            if (!depth) {
                return 'nca run nca notice update-modules';
            }
            return 'nca run nca update-modules --depth ' + depth;
        }

        /**
         * generate command to release
         * @private
         */

    }, {
        key: 'releaseCommand',
        value: function releaseCommand(arYml) {
            var options = {
                prefix: arYml.config('version_prefix'),
                branch: !!arYml.config('create_branch'),
                shrinkwrap: !!arYml.config('npm_shrinkwrap')
            };
            return 'nca release ' + this.optionStr(options);
        }

        /**
         * generate command to create gh-pages branch
         * @private
         */

    }, {
        key: 'ghPagesCommand',
        value: function ghPagesCommand(create, dir) {

            if (!create) {
                return 'nca run nca notice gh-pages';
            }
            var command = 'nca run nca gh-pages';
            if (dir) {
                command += ' --dir ' + dir;
            }
            return command;
        }

        /**
         * generate command line option string
         * @private
         */

    }, {
        key: 'optionStr',
        value: function optionStr(options) {

            return Object.keys(options).map(function (key) {

                var val = options[key];

                if (typeof val === 'boolean') {
                    return val ? '--' + key : '';
                }

                return val != null ? '--' + key + ' ' + val : '';
            }).filter(function (v) {
                return v;
            }).join(' ');
        }
    }]);

    return CircleYml;
}();

exports.default = CircleYml;


function flat() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    return args.reduce(function (arr, v) {
        if (Array.isArray(v)) {
            return arr.concat(flat.apply(undefined, _toConsumableArray(v)));
        } else {
            arr.push(v);
        }
        return arr;
    }, []);
}