'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

var _path = require('path');

var _deepmerge = require('deepmerge');

var _deepmerge2 = _interopRequireDefault(_deepmerge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Reader/Writer of .autorelease.yml
 */

var AutoreleaseYml = function () {
    _createClass(AutoreleaseYml, null, [{
        key: 'loadFromDir',


        /**
         * load yml file in the given directory
         * @public
         */
        value: function loadFromDir(dirPath) {
            var path = (0, _path.join)(dirPath, this.filename);
            return new AutoreleaseYml(path);
        }
    }, {
        key: 'defaultValues',


        /**
         * default values, used when no file exists
         */
        get: function get() {
            return {
                hooks: {
                    update_modules: { pre: ['echo "before update-modules"'], post: ['echo "after update-modules"'] },
                    release: { pre: ['echo "before release"'], post: ['echo "after release"'] },
                    gh_pages: { pre: ['echo "before gh-pages"'], post: ['echo "after gh-pages"'] }
                },
                config: this.defaultConfig,
                circle: {}
            };
        }

        /**
         * default configs
         */

    }, {
        key: 'defaultConfig',
        get: function get() {
            return {
                git_user_name: 'CircleCI',
                git_user_email: 'circleci@example.com',

                // options for nca update-modules
                npm_update_depth: 0,

                // options for nca release
                version_prefix: 'v',
                create_branch: false,
                npm_shrinkwrap: false,

                // options for nca gh-pages
                create_gh_pages: false,
                gh_pages_dir: null

            };
        }
    }]);

    function AutoreleaseYml(path) {
        _classCallCheck(this, AutoreleaseYml);

        this.loaded = false;

        try {
            this.__data = _jsYaml2.default.safeLoad(_fs2.default.readFileSync(path, 'utf8'));
            this.loaded = true;
        }
        // if .autorelease.yml is not found, silently prepare a default object
        catch (e) {
            this.__data = this.constructor.defaultValues;
        }
    }

    /**
     * get hook commands (except bmp hook)
     * @public
     * @param name hook name
     * @param timing one of [update_modules release gh_pages]
     */


    _createClass(AutoreleaseYml, [{
        key: 'hooks',
        value: function hooks(name, timing) {
            if (!(this.hookNames.indexOf(name) !== -1)) throw new Error('Invalid hook name: "' + name + '" was given.');
            if (!this.__data.hooks) return [];
            var hookObjs = this.__data.hooks[name];
            if (!hookObjs) return [];

            var hooks = hookObjs[timing];
            var hookArr = Array.isArray(hooks) ? hooks : hooks ? [hooks] : [];
            return hookArr.map(this.addOkCommandBeforeHook, this); // Notice that "this" will change
        }

        /**
         * get bmp hook commands
         * @public
         * @param timing one of [update_modules release gh_pages]
         */

    }, {
        key: 'bmpHooks',
        value: function bmpHooks(timing) {
            if (!this.__data.hooks) return [];
            var hookObjs = this.__data.hooks.bmp;
            if (!hookObjs) return [];

            var hooks = hookObjs[timing];
            return Array.isArray(hooks) ? hooks : hooks ? [hooks] : [];
        }

        /**
         * attach 'nca run' before command
         */

    }, {
        key: 'addOkCommandBeforeHook',
        value: function addOkCommandBeforeHook(hookCommand) {
            // "--" cannot be recognized by node.js
            return 'nca run ' + hookCommand.split(' -- ').join(' --- ');
        }

        /**
         * @public
         */

    }, {
        key: 'config',
        value: function config(key) {
            var val = this.__data.config ? this.__data.config[key] : undefined;
            return val != null ? val : this.constructor.defaultConfig[key];
        }

        /**
         * @public
         */

    }, {
        key: 'setNodeVersion',


        /**
         * set node version to circle section
         * @public
         * @param version node version
         */
        value: function setNodeVersion(version) {
            this.__data.circle = (0, _deepmerge2.default)(this.__data.circle, { machine: { node: { version: version } } });
        }

        /**
         * get YAML format
         */

    }, {
        key: 'toString',
        value: function toString() {
            return _jsYaml2.default.dump(this.__data, { indent: 2, lineWidth: 120 });
        }

        /**
         * save .autorelease.yml to the given directory
         */

    }, {
        key: 'saveTo',
        value: function saveTo(dir) {
            var path = (0, _path.join)(dir, this.constructor.filename);
            _fs2.default.writeFileSync(path, this.toString());
        }

        /**
         * check format of autorelease.yml
         * @public
         */

    }, {
        key: 'checkFormat',
        value: function checkFormat() {
            var _this = this;

            if (!this.__data) throw new Error('Yaml has not been loaded.');

            Object.keys(this.__data).forEach(function (name) {
                if (!(_this.rootFieldNames.indexOf(name) !== -1)) {
                    throw new Error('Unknown field: "' + name + '"');
                }
            });

            var _data = this.__data;
            var hooks = _data.hooks;
            var config = _data.config;
            var circle = _data.circle;


            if (hooks) this.checkHooksFormat(hooks);
            if (config) this.checkConfigFormat(config);
            if (circle) this.checkCircleFormat(circle);
        }

        /**
         * @private
         */

    }, {
        key: 'checkHooksFormat',


        /**
         * @private
         */
        value: function checkHooksFormat(hooks) {
            var _this2 = this;

            Object.keys(hooks).forEach(function (name) {
                if (!(_this2.hookNames.indexOf(name) !== -1)) {
                    throw new Error('Unknown field: "hooks.' + name + '"');
                }

                if (!hooks[name].pre && !hooks[name].post) {
                    throw new Error('Field not found: "hooks.' + name + '.pre" or "hooks.' + name + '.post" is required.');
                }

                Object.keys(hooks[name]).forEach(function (subname) {
                    if (!(['pre', 'post'].indexOf(subname) !== -1)) {
                        throw new Error('Unknown field: "hooks.' + name + '.' + subname + '"');
                    }
                    _this2.checkHookCommandFormat(hooks[name][subname], name, subname);
                });
            });
        }

        /**
         * @private
         */

    }, {
        key: 'checkHookCommandFormat',
        value: function checkHookCommandFormat(cmds, name, subname) {
            if (typeof cmds === 'string') {
                return;
            }

            if (Array.isArray(cmds)) {
                if (typeof cmds === 'string') {
                    return;
                }
                return;
            }

            throw new Error('Invalid type: "hooks.' + name + '.' + subname + '". It should be an array or a string.');
        }

        /**
         * @private
         */

    }, {
        key: 'checkConfigFormat',
        value: function checkConfigFormat(config) {
            var _this3 = this;

            Object.keys(config).filter(function (name) {
                return config[name] != null;
            }).forEach(function (name) {
                if (!(_this3.configNames.indexOf(name) !== -1)) {
                    throw new Error('Unknown field: "config.' + name + '"');
                }

                if (_typeof(config[name]) === 'object') {
                    throw new Error('Invalid type: "config.' + name + '". "It should not be an object."');
                }
            });
        }

        /**
         * @private
         */

    }, {
        key: 'checkCircleFormat',
        value: function checkCircleFormat(circle) {
            if (!circle) return;

            // TODO
            return;
        }
    }, {
        key: 'circle',
        get: function get() {
            return _extends({}, this.__data.circle);
        }
    }, {
        key: 'rootFieldNames',
        get: function get() {
            return ['hooks', 'config', 'circle'];
        }

        /**
         * @private
         */

    }, {
        key: 'hookNames',
        get: function get() {
            return ['update_modules', 'release', 'gh_pages', 'bmp'];
        }

        /**
         * @private
         */

    }, {
        key: 'configNames',
        get: function get() {
            return Object.keys(this.constructor.defaultConfig);
        }
    }]);

    return AutoreleaseYml;
}();

AutoreleaseYml.filename = '.autorelease.yml';
exports.default = AutoreleaseYml;