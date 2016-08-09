#!/usr/bin/env node
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.run = run;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _packageJsonLoader = require('../lib/package-json-loader');

var _packageJsonLoader2 = _interopRequireDefault(_packageJsonLoader);

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var version = _packageJsonLoader2.default.load(__dirname + '/../..').version;
/*eslint no-console: 0 */

_commander2.default.version(version);

var subcommands = {
    'init': 'add .autorelease.yml to your project',
    'generate': 'generate circle.yml',
    'bmp': 'generate circle.yml and bumping version',
    'update-modules': 'update node modules',
    'release': 'release current version',
    'gh-pages': 'create "gh-pages" branch for documentation',
    'notice': 'show notice',
    'run': 'execute commands at releasable timings'
};

Object.keys(subcommands).filter(function (sub) {
    return _fs2.default.existsSync(__dirname + '/nca-' + sub + '.js');
}).forEach(function (sub) {
    return _commander2.default.command(sub, subcommands[sub]);
});

function run(args) {
    var argv = args.slice();
    argv.unshift(process.execPath, __filename);
    _commander2.default.parse(argv);
}

if (require.main === module) run(process.argv.slice(2));