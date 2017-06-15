'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _iceCap = require('ice-cap');

var _iceCap2 = _interopRequireDefault(_iceCap);

var _DocBuilder = require('./DocBuilder.js');

var _DocBuilder2 = _interopRequireDefault(_DocBuilder);

var _util = require('./util.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Index output builder class.
 */
class IndexDocBuilder extends _DocBuilder2.default {
  /**
   * create instance.
   * @param {Taffy} data - doc object database.
   * @param {ESDocConfig} config - use config to build output.
   * @param {CoverageObject} coverage - use coverage to build output.
   */
  constructor(data, config, coverage) {
    super(data, config);
    this._coverage = coverage;
  }

  /**
   * execute building output.
   * @param {function(html: string, filePath: string)} callback - is called with output.
   */
  exec(callback) {
    const ice = this._buildLayoutDoc();
    const title = this._getTitle();
    ice.load('content', this._buildIndexDoc());
    ice.text('title', title, _iceCap2.default.MODE_WRITE);
    callback(ice.html, 'index.html');
  }

  /**
   * build index output.
   * @returns {string} html of index output.
   * @private
   */
  _buildIndexDoc() {
    if (!this._config.index) return 'Please create README.md';

    let indexContent;
    try {
      indexContent = _fs2.default.readFileSync(this._config.index, { encode: 'utf8' }).toString();
    } catch (e) {
      return 'Please create README.md';
    }

    const html = this._readTemplate('index.html');
    const ice = new _iceCap2.default(html);
    const ext = _path2.default.extname(this._config.index);
    if (['.md', '.markdown'].includes(ext)) {
      ice.load('index', (0, _util.markdown)(indexContent));
    } else {
      ice.load('index', indexContent);
    }

    return ice.html;
  }
}
exports.default = IndexDocBuilder;