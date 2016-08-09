'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _exec4 = require('../util/exec');

var _exec5 = _interopRequireDefault(_exec4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Executes release process
 */

var ReleaseExecutor = function () {
    function ReleaseExecutor(log) {
        _classCallCheck(this, ReleaseExecutor);

        this.log = log;
    }

    /**
     * Release the version
     * @public
     * @param version version name formatted as X.Y.Z
     * @param shrinkwrap  [] whether or not to run `npm shrinkwrap`
     * @param branch  whether or not to release branch
     */


    _createClass(ReleaseExecutor, [{
        key: 'release',
        value: function release(version) {
            var shrinkwrap = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
            var branch = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
            var remote = arguments.length <= 3 || arguments[3] === undefined ? 'origin' : arguments[3];


            this.exec('git checkout -b release-' + version);
            this.ignoreFiles();

            if (shrinkwrap) {
                this.addShrinkwrap();
            }

            this.exec('git add -A');
            this.exec('git commit -m ' + version);
            this.exec('git tag ' + version);

            var _exec2 = this.exec('git push --force ' + remote + ' ' + version);

            var code = _exec2.code;

            if (!this.isPushSucceeded(code)) {
                return false;
            }

            if (branch) {
                this.pushReleaseBranch(version, remote);
            }

            // re-install dev-dependent modules
            if (shrinkwrap) {
                this.log('---- re-installing node_modules after shrinkwrap ----');
                this.exec('npm install');
            }
            return true;
        }

        /**
         * publish npm
         * @public
         */

    }, {
        key: 'publishNpm',
        value: function publishNpm(email, auth) {
            var path = arguments.length <= 2 || arguments[2] === undefined ? '.npmrc' : arguments[2];


            var npmrc = '_auth=' + auth + '\nemail=' + email + '\n';
            this.write(path, npmrc);
            this.exec('cp .releaseignore .npmignore');

            var _exec3 = this.exec('npm publish');

            var stdout = _exec3.stdout;
            var code = _exec3.code;

            this.exec('rm .npmignore');
            this.exec('rm .npmrc');

            return code === 0 ? stdout.trim().split('@')[1] : null;
        }

        /**
        * ignore files in .releaseignore
        * @private
        */

    }, {
        key: 'ignoreFiles',
        value: function ignoreFiles() {
            this.exec('cp .releaseignore .git/info/exclude');
            this.exec('git rm .gitignore');

            var filesToRemove = this.exec('git ls-files --full-name -i --exclude-from .releaseignore').stdout;

            if (filesToRemove) {
                // TODO manage files with space
                this.exec('git rm --cached ' + filesToRemove.split('\n').join(' '));
            }
        }

        /**
         * Add shrinkwrap.json before release
         *
         * On npm v2,
         *
         *  - `npm shrinkwrap` omits dev-dependent modules
         *  -  wrongly omits dev-dependent modules which are sub-dependent
         *
         *  On npm v3,
         *  - `npm shrinkwrap` includes some (not all) of dev-dependent modules
         *  - after `npm prune --production`, it's ok
         *
         *  Currenlty, the following process is the only way to get the correct result on npm >=v2.
         *
         *  ```sh
         *  rm -rf node_modules
         *  npm install --production
         *  npm shrinkwrap
         *  ```
         * @see https://github.com/npm/npm/issues/11189
         *
         * @private
         */

    }, {
        key: 'addShrinkwrap',
        value: function addShrinkwrap() {
            this.exec('rm -rf node_modules');
            this.exec('npm install --production');
            this.exec('npm shrinkwrap');
        }

        /**
         * @check if push succeeded
         * @private
         */

    }, {
        key: 'isPushSucceeded',
        value: function isPushSucceeded(code) {
            return code === 0;
        }

        /**
         * push release branch after pushing tag
         * @private
         */

    }, {
        key: 'pushReleaseBranch',
        value: function pushReleaseBranch(version, remote) {
            this.exec('git add -f circle.yml');
            this.exec('git commit --allow-empty -m "add circle.yml for release"');
            this.exec('git push --force ' + remote + ' release-' + version);
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
            return _exec5.default.apply(undefined, arguments);
        }
    }]);

    return ReleaseExecutor;
}();

exports.default = ReleaseExecutor;