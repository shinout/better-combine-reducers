'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = run;

var _child_process = require('child_process');

var _exec = require('../util/exec');

var _exec2 = _interopRequireDefault(_exec);

var _releasabilityChecker = require('../lib/releasability-checker');

var _releasabilityChecker2 = _interopRequireDefault(_releasabilityChecker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); } /*eslint no-console: 0 */


function run(argv) {

    var command = argv.join(' ');

    if (!isReleasable()) {
        console.log('Non-releasable state, skip command: "' + command + '"');
        return process.exit(0);
    }

    console.log('executing "' + command + '"');

    var _argv = _toArray(argv);

    var bin = _argv[0];

    var args = _argv.slice(1);

    (0, _child_process.spawn)(bin, args, { stdio: 'inherit' });
}

function isReleasable() {

    if (isReleaseFinished()) {
        return true;
    }

    var checker = new _releasabilityChecker2.default();
    return checker.isReleasable;
}

// Currently, we regard it as "release finished" that
// the pushed branch name differs from current one.
function isReleaseFinished() {
    var currentBranch = (0, _exec2.default)('git rev-parse --abbrev-ref HEAD', { silent: true }).stdout.trim();
    return process.env.CIRCLECI && process.env.CIRCLE_BRANCH != currentBranch;
}

if (require.main === module) run(process.argv.slice(2));