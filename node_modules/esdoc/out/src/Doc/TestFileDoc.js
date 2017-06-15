'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _FileDoc = require('./FileDoc.js');

var _FileDoc2 = _interopRequireDefault(_FileDoc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Doc class for test code file.
 */
class TestFileDoc extends _FileDoc2.default {
  /** set ``testFile`` to kind. */
  _$kind() {
    this._value.kind = 'testFile';
  }
}
exports.default = TestFileDoc;