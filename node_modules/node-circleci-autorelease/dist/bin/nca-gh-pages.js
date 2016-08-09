'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = run;

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _ghPagesCreator = require('../lib/gh-pages-creator');

var _ghPagesCreator2 = _interopRequireDefault(_ghPagesCreator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*eslint no-console: 0 */
function run() {

    _commander2.default.arguments('<bump-level>', /[pmjr]/).option('--dir <directory>', 'directory to host').parse(process.argv);

    var dir = _commander2.default.dir;


    if (!dir) {
        console.log(HOW_TO_HOST_SPECIFIC_DIR);
    }

    new _ghPagesCreator2.default().create(dir);
}

var HOW_TO_HOST_SPECIFIC_DIR = '\n    All files in master branch will be added to gh-pages.\n    Set \'config.gh_pages_dir\' in .autorelease.yml.\n    Then, only the contents of the directory are added to gh-pages.\n';

if (require.main === module) run();