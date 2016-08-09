'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = run;

var _exec = require('../util/exec');

var _exec2 = _interopRequireDefault(_exec);

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*eslint no-console: 0 */
function run() {

    _commander2.default.option('--depth <module depth>', 'depth of npm modules to update', parseInt).parse(process.argv);

    var depth = _commander2.default.depth;


    if (!depth) return process.exit(0);

    if (getMajorNpmVersion() < 3) {
        console.log(WHY_NPM2_IS_NOT_RECOMMENDED);
        (0, _exec2.default)('npm update --depth ' + depth);
    } else {
        (0, _exec2.default)('npm update --dev --depth ' + depth);
    }
}

function getMajorNpmVersion() {
    return Number((0, _exec2.default)('npm -v', { silent: true }).stdout.split('.')[0]);
}

var WHY_NPM2_IS_NOT_RECOMMENDED = '\n---------------------------------------------------------------\n  To update node_modules, npm version should be 3 or more.\n\n  This is because npm v2 has a bug that it tries to install\n  devDependencies of submodules when --dev option is set.\n\n  https://github.com/npm/npm/issues/5554\n\n  As a workaround, we omit updating devDependencies in npm v2.\n----------------------------------------------------------------\n';

if (require.main === module) run();