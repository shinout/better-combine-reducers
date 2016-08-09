'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = run;

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function run() {

    _commander2.default.arguments('<msg-type>').parse(process.argv);

    switch (_commander2.default.args[0]) {
        case 'gh-pages':
            console.log(GH_PAGES_BRANCH_WAS_NOT_CREATED);
            return;

        case 'update-modules':
            console.log(UPDATE_MODULES_WERE_NOT_EXECUTED);
            return;
    }
} /*eslint no-console: 0 */


var GH_PAGES_BRANCH_WAS_NOT_CREATED = '\n--------------------------------------------------------\nBranch "gh-pages" was not created.\nIf you would like to create it, edit .autorelease.yml\nlike the code below.\n\n    config:\n      create_gh_pages: true\n      gh_pages_dir: doc # directory to host in gh-pages\n\n--------------------------------------------------------\n';

var UPDATE_MODULES_WERE_NOT_EXECUTED = '\n--------------------------------------------------------\nDependent node_modules were not updated.\nIf you would like to update them, edit .autorelease.yml\nlike the code below.\n\n    config:\n      npm_update_depth: 4 # greater than 0 -> updated\n\n--------------------------------------------------------\n';

if (require.main === module) run();