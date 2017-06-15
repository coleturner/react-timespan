'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _iceCap = require('ice-cap');

var _iceCap2 = _interopRequireDefault(_iceCap);

var _DocBuilder = require('./DocBuilder.js');

var _DocBuilder2 = _interopRequireDefault(_DocBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Identifier output builder class.
 */
class IdentifiersDocBuilder extends _DocBuilder2.default {
  /**
   * execute building output.
   * @param {function(html: string, filePath: string)} callback - is called with output.
   */
  exec(callback) {
    const ice = this._buildLayoutDoc();
    const title = this._getTitle('Index');
    ice.load('content', this._buildIdentifierDoc());
    ice.text('title', title, _iceCap2.default.MODE_WRITE);
    callback(ice.html, 'identifiers.html');
  }

  /**
   * build identifier output.
   * @return {IceCap} built output.
   * @private
   */
  _buildIdentifierDoc() {
    const indexInfo = this._getInfo();

    const ice = new _iceCap2.default(this._readTemplate('identifiers.html'));

    ice.text('title', indexInfo.title);
    ice.text('version', indexInfo.version, 'append');
    ice.text('url', indexInfo.url);
    ice.attr('url', 'href', indexInfo.url);
    ice.text('description', indexInfo.desc);

    ice.load('classSummary', this._buildSummaryHTML(null, 'class', 'Class Summary'), 'append');
    ice.load('interfaceSummary', this._buildSummaryHTML(null, 'interface', 'Interface Summary'), 'append');
    ice.load('functionSummary', this._buildSummaryHTML(null, 'function', 'Function Summary'), 'append');
    ice.load('variableSummary', this._buildSummaryHTML(null, 'variable', 'Variable Summary'), 'append');
    ice.load('typedefSummary', this._buildSummaryHTML(null, 'typedef', 'Typedef Summary'), 'append');
    ice.load('externalSummary', this._buildSummaryHTML(null, 'external', 'External Summary'), 'append');

    return ice;
  }
}
exports.default = IdentifiersDocBuilder;