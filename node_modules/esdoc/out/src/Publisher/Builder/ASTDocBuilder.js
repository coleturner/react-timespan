'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _DocBuilder = require('./DocBuilder.js');

var _DocBuilder2 = _interopRequireDefault(_DocBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * AST Output Builder class.
 */
class ASTDocBuilder extends _DocBuilder2.default {
  /**
   * create instance.
   * @param {Taffy} data - doc comment database.
   * @param {AST[]} asts - all source code ASTs.
   * @param {ESDocConfig} config - ESDoc config object.
   */
  constructor(data, asts, config) {
    super(data, config);
    this._asts = asts;
  }

  /**
   * execute building output.
   * @param {function(ast: string, filePath: string)} callback - is called each asts.
   */
  exec(callback) {
    for (const ast of this._asts) {
      const json = JSON.stringify(ast.ast, null, 2);
      const filePath = `ast/${ ast.filePath }.json`;
      callback(json, filePath);
    }
  }
}
exports.default = ASTDocBuilder;