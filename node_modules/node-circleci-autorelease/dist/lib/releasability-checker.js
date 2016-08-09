'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _exec2 = require('../util/exec');

var _exec3 = _interopRequireDefault(_exec2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NON_RELEASE_COMMIT_MESSAGE = '\n----------------------------------------------------------------\n    No release process is going to start, because\n    the latest commit log is not valid.\n    Run one of the following command to get valid commit log.\n\n        $(npm bin)/nca bmp p # patch level (0.0.1)\n        $(npm bin)/nca bmp m # minor level (0.1.0)\n        $(npm bin)/nca bmp j # major level (1.0.0)\n        $(npm bin)/nca bmp r # re-release  (0.0.0)\n\n    Valid commit log message formats are the followings.\n    These are automatically set via the commands above.\n\n        release X.Y.Z\n        re-release X.Y.Z\n\n----------------------------------------------------------------\n';

/**
 * Checker for releasability
 */

var ReleasabilityChecker = function () {
    function ReleasabilityChecker() {
        _classCallCheck(this, ReleasabilityChecker);

        this.__commitMsg = null; // cache
    }

    /**
     * @public
     */


    _createClass(ReleasabilityChecker, [{
        key: 'exec',
        value: function exec() {
            return _exec3.default.apply(undefined, arguments);
        }
    }, {
        key: 'isReleasable',
        get: function get() {
            return this.logVersion != null;
        }

        /**
         * @public
         */

    }, {
        key: 'warnMessage',
        get: function get() {
            if (!this.logVersion) {
                return NON_RELEASE_COMMIT_MESSAGE;
            }
        }
    }, {
        key: 'commitMsg',
        get: function get() {
            return this.__commitMsg || this.exec('git log --pretty=format:"%s" -1', { silent: true }).stdout;
        }

        /**
         * @public
         */

    }, {
        key: 'logVersion',
        get: function get() {
            if (!this.commitMsg.match(/^(re-)?release +[0-9]+\./)) {
                return null;
            }

            return this.commitMsg.split(/release +/)[1];
        }
    }]);

    return ReleasabilityChecker;
}();

exports.default = ReleasabilityChecker;