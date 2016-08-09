'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = exec;

var _shelljs = require('shelljs');

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*eslint no-console: 0 */


var CHECK_OK = '✓';
var CHECK_NG = '✖';

function exec(command) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];


    var dryRun = !!process.env.DRY_RUN;

    var log = options.silent ? function () {} : console.log.bind(console);
    var error = options.silent ? function () {} : console.error.bind(console);

    if (dryRun) {
        log(_chalk2.default.yellow('[DRY RUN]: ' + command));
        return { command: command, stdout: '[DRY RUN]', stderr: '[DRY RUN]', code: 0 };
    } else {
        var result = (0, _shelljs.exec)(command, { silent: true });
        var succeeded = result.code === 0;
        var color = succeeded ? 'green' : 'red';
        var check = succeeded ? CHECK_OK : CHECK_NG;
        log(_chalk2.default[color](' ' + check + '  ' + command));

        if (!succeeded) {
            log('\tSTDOUT: ');
            log(_chalk2.default.red(result.stdout));
            error('\tSTDERR: ');
            error(_chalk2.default.red(result.stderr));
        }

        return result;
    }
}