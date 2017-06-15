'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _AbstractDoc = require('./AbstractDoc.js');

var _AbstractDoc2 = _interopRequireDefault(_AbstractDoc);

var _ParamParser = require('../Parser/ParamParser.js');

var _ParamParser2 = _interopRequireDefault(_ParamParser);

var _babelGenerator = require('babel-generator');

var _babelGenerator2 = _interopRequireDefault(_babelGenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Doc Class from Method Definition AST node.
 */
class MethodDoc extends _AbstractDoc2.default {
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

  /** use kind property of self node. */
  _$kind() {
    super._$kind();
    this._value.kind = this._node.kind;
  }

  /** take out self name from self node */
  _$name() {
    super._$name();

    if (this._node.computed) {
      const expression = (0, _babelGenerator2.default)(this._node.key).code;
      this._value.name = `[${ expression }]`;
    } else {
      this._value.name = this._node.key.name;
    }
  }

  /** take out memberof from parent class node */
  _$memberof() {
    super._$memberof();

    let memberof;
    let parent = this._node.parent;
    while (parent) {
      if (parent.type === 'ClassDeclaration' || parent.type === 'ClassExpression') {
        memberof = `${ this._pathResolver.filePath }~${ parent.doc.value.name }`;
        this._value.memberof = memberof;
        return;
      }
      parent = parent.parent;
    }
  }

  /** if @param is not exists, guess type of param by using self node. but ``get`` and ``set`` are not guessed. */
  _$param() {
    super._$param();
    if (this._value.params) return;

    if (['set', 'get'].includes(this._value.kind)) return;

    this._value.params = _ParamParser2.default.guessParams(this._node.params);
  }

  /** if @type is not exists, guess type by using self node. only ``get`` and ``set`` are guess. */
  _$type() {
    super._$type();
    if (this._value.type) return;

    /* eslint-disable default-case */
    switch (this._value.kind) {
      case 'set':
        this._value.type = _ParamParser2.default.guessType(this._node.right);
        break;
      case 'get':
        {
          const result = _ParamParser2.default.guessReturnParam(this._node.body);
          if (result) this._value.type = result;
          break;
        }
    }
  }

  /**
   * if @return is not exists, guess type of return by using self node.
   * but ``constructor``, ``get`` and ``set``are not guessed.
   */
  _$return() {
    super._$return();
    if (this._value.return) return;

    if (['constructor', 'set', 'get'].includes(this._value.kind)) return;

    const result = _ParamParser2.default.guessReturnParam(this._node.body);
    if (result) {
      this._value.return = result;
    }
  }

  /** use generator property of self node. */
  _$generator() {
    super._$generator();

    this._value.generator = this._node.generator;
  }

  /**
   * use async property of self node.
   */
  _$async() {
    super._$async();

    this._value.async = this._node.async;
  }
}
exports.default = MethodDoc;