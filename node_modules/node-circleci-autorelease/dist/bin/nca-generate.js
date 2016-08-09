'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = run;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _workingDirectory = require('../lib/working-directory');

var _workingDirectory2 = _interopRequireDefault(_workingDirectory);

var _autoreleaseYml = require('../lib/autorelease-yml');

var _autoreleaseYml2 = _interopRequireDefault(_autoreleaseYml);

var _circleYml = require('../lib/circle-yml');

var _circleYml2 = _interopRequireDefault(_circleYml);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*eslint no-console: 0 */
function run() {
    var skipShowingWhatToDoNext = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];


    var rootDir = new _workingDirectory2.default().resolve();

    var arYml = _autoreleaseYml2.default.loadFromDir(rootDir);

    arYml.checkFormat();

    var ymlStr = _circleYml2.default.generate(arYml);

    var filename = (0, _path.join)(rootDir, 'circle.yml');

    if (process.env.DRY_RUN) {
        console.log(_chalk2.default.yellow('[DRY RUN]: generating circle.yml'));
        console.log(_chalk2.default.yellow(ymlStr));
    } else {
        _fs2.default.writeFileSync(filename, ymlStr);
        console.log(_chalk2.default.green('circle.yml was successfully generated!'));
    }

    if (!skipShowingWhatToDoNext) console.log(WHAT_TO_DO_NEXT);
}

var WHAT_TO_DO_NEXT = '\n-----------------------------------------------------------------\n    What you do next:\n\n    1. check your circle.yml\n\n        $EDITOR circle.yml\n\n    2. commit the changes\n\n        git add -A\n        git commit -m "add circle.yml"\n\n    3. version bumping\n\n        $(npm bin)/nca bmp p # patch level version up\n        $(npm bin)/nca bmp m # minor level version up\n        $(npm bin)/nca bmp j # major level version up\n\n-----------------------------------------------------------------\n';

if (require.main === module) run();