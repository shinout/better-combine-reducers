'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = run;

var _shelljs = require('shelljs');

var _exec = require('../util/exec');

var _exec2 = _interopRequireDefault(_exec);

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _workingDirectory = require('../lib/working-directory');

var _workingDirectory2 = _interopRequireDefault(_workingDirectory);

var _packageJsonLoader = require('../lib/package-json-loader');

var _packageJsonLoader2 = _interopRequireDefault(_packageJsonLoader);

var _autoreleaseYml = require('../lib/autorelease-yml');

var _autoreleaseYml2 = _interopRequireDefault(_autoreleaseYml);

var _ncaGenerate = require('./nca-generate');

var _ncaGenerate2 = _interopRequireDefault(_ncaGenerate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var COMMAND_DESC = '\n  bump-level:\n    p: patch level (0.0.1)\n    m: minor level (0.1.0)\n    j: major level (1.0.0)\n    r: re-release (0.0.0)\n'; /*eslint no-console: 0 */


var optionNames = {
    p: 'patch',
    m: 'minor',
    j: 'major'
};

function run() {

    _commander2.default.arguments('<bump-level>', /[pmjr]/).option('-s, --skipCircle', 'No generation of circle.yml').description(COMMAND_DESC).parse(process.argv);

    var arg = _commander2.default.args[0];

    if (!arg) {
        _commander2.default.help();
    }

    var bin = getBmpBin();

    if (!bin) {
        console.log(_chalk2.default.red(HOW_TO_INSTALL_BMP_OR_YANGPAO));
        process.exit(1);
    }

    if (_commander2.default.skipCircle) {
        console.log('skip generating circle.yml');
    } else {
        (0, _ncaGenerate2.default)(true); // skip showing what to do next
        console.log(HOW_TO_SKIP_GENERATION_OF_CIRCLE_YML);
    }

    var verb = arg === 'r' ? 're-release' : 'release';

    var optionName = optionNames[arg];

    if (optionName) {
        var rootDir = new _workingDirectory2.default().resolve();
        var arYml = _autoreleaseYml2.default.loadFromDir(rootDir);

        arYml.bmpHooks('pre').forEach(function (cmd) {
            return (0, _exec2.default)(cmd);
        });

        (0, _exec2.default)(bin + ' --' + optionName);

        arYml.bmpHooks('post').forEach(function (cmd) {
            return (0, _exec2.default)(cmd);
        });
    }

    var version = getCurrentVersion();

    (0, _exec2.default)('git add -A');
    (0, _exec2.default)('git commit --allow-empty -m "' + verb + ' ' + version + '"');
    console.log(NOTICE_AFTER_BUMPING);

    return 0;
}

/**
 * Get the current version
 * @private
 */
function getCurrentVersion() {
    var cwd = new _workingDirectory2.default().resolve();
    return _packageJsonLoader2.default.load(cwd).version;
}

/**
 * Get bmp|yangpao full path
 * @private
 */
function getBmpBin() {
    var cwd = new _workingDirectory2.default().resolve();

    if (_fs2.default.existsSync(cwd + '/.yangpao.toml')) {
        return (0, _shelljs.which)('yangpao');
    }
    if (_fs2.default.existsSync(cwd + '/.bmp.yml')) {
        return (0, _shelljs.which)('bmp');
    }
}

var HOW_TO_SKIP_GENERATION_OF_CIRCLE_YML = '\n\n    To skip circle.yml generation,\n    run with --skipCircle (or -s) option.\n\n';

var HOW_TO_INSTALL_BMP_OR_YANGPAO = '\n    You need to install one of the version-bumping tools of the followings,\n\n        - [bmp](https://github.com/kt3k/bmp)\n        - [yangpao](https://github.com/januswel/yangpao)\n\n    ## install bmp\n    \tgem install bmp\n\n    ## install yangpao\n    \tgo get github.com/januswel/yangpao\n\n    Make sure to run this command on project root.\n';

/**
 * Show notice after git commit
 * @private
 */
var NOTICE_AFTER_BUMPING = '\n----------------------------------------------------------------------------\n  Before pushing to github, make sure the following settings have been done.\n\n  1. Checkout SSH keys [required]\n       Confirm CircleCI setting if your user key is registered.\n\n  2. Set Environment variables for publishing npm [optional]\n       Name: NPM_AUTH\n       Value: (value of \'_auth\' at your .npmrc after \'npm login\')\n\n       Name: NPM_EMAIL\n       Value: (your email registered to npm)\n\n  If you mistakenly ran this command, you can reset by\n\n      git reset HEAD^\n                       Don\'t be upset :)\n----------------------------------------------------------------------------\n';

if (require.main === module) run();