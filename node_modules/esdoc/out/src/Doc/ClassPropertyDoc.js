'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _AbstractDoc = require('./AbstractDoc.js');

var _AbstractDoc2 = _interopRequireDefault(_AbstractDoc);

var _MethodDoc = require('./MethodDoc.js');

var _MethodDoc2 = _interopRequireDefault(_MethodDoc);

var _ParamParser = require('../Parser/ParamParser.js');

var _ParamParser2 = _interopRequireDefault(_ParamParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Doc Class from ClassProperty AST node.
 */
class ClassPropertyDoc extends _AbstractDoc2.default {
  /**
   * apply own tag.
   * @private
   */
  _apply() {
    super._apply();

    Reflect.deleteProperty(this._value, 'export');
    Reflect.deleteProperty(this._value, 'importPath');
    Reflect.deleteProperty(this._value, 'importStyle');
  }

  /** specify ``member`` to kind. */
  _$kind() {
    super._$kind();
    this._value.kind = 'member';
  }

  /** take out self name from self node */
  _$name() {
    super._$name();
    this._value.name = this._node.key.name;
  }

  /** borrow {@link MethodDoc#@_memberof} */
  _$memberof() {
    Reflect.apply(_MethodDoc2.default.prototype._$memberof, this, []);
  }

  /** if @type is not exists, guess type by using self node */
  _$type() {
    super._$type();
    if (this._value.type) return;

    this._value.type = _ParamParser2.default.guessType(this._node.value);
  }
}
exports.default = ClassPropertyDoc;