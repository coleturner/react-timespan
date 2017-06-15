'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _Plugin = require('../Plugin/Plugin.js');

var _Plugin2 = _interopRequireDefault(_Plugin);

var _babylon = require('babylon');

var babylon = _interopRequireWildcard(_babylon);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * ECMAScript Parser class.
 *
 * @example
 * let ast = ESParser.parse('./src/foo.js');
 */
class ESParser {
  /**
   * parse ECMAScript source code.
   * @param {ESDocConfig} config - config of esdoc.
   * @param {string} filePath - source code file path.
   * @returns {AST} AST of source code.
   */
  static parse(config, filePath) {
    return this._parseWithBabylon(config, filePath);
  }

  /**
   * parse ECMAScript source code with babylon.
   * @param {ESDocConfig} config - config of esdoc.
   * @param {string} filePath - source code file path.
   * @returns {AST} AST of source code.
   */
  static _parseWithBabylon(config, filePath) {
    let code = _fsExtra2.default.readFileSync(filePath, { encode: 'utf8' }).toString();
    code = _Plugin2.default.onHandleCode(code, filePath);
    if (code.charAt(0) === '#') code = code.replace(/^#!/, '//');

    const option = this._buildParserOptionForBabylon(config);

    let parser = code => {
      return babylon.parse(code, option);
    };

    parser = _Plugin2.default.onHandleCodeParser(parser, option, filePath, code);

    let ast = parser(code);

    ast = _Plugin2.default.onHandleAST(ast, filePath, code);

    return ast;
  }

  /**
   * build babylon option.
   * @param {ESDocConfig} config - config of esdoc
   * @returns {{sourceType: string, plugins: string[]}} option of babylon.
   * @private
   */
  static _buildParserOptionForBabylon(config) {
    const option = {
      sourceType: 'module',
      plugins: ['jsx']
    };

    const experimental = config.experimentalProposal;

    if (experimental) {
      if (experimental.classProperties) option.plugins.push('classProperties');
      if (experimental.objectRestSpread) option.plugins.push('objectRestSpread');
      if (experimental.doExpressions) option.plugins.push('doExpressions');
      if (experimental.functionBind) option.plugins.push('functionBind');
      if (experimental.functionSent) option.plugins.push('functionSent');
      if (experimental.asyncGenerators) option.plugins.push('asyncGenerators');
      if (experimental.asyncGenerators) option.plugins.push('asyncGenerators');
      if (experimental.decorators) option.plugins.push('decorators');
      if (experimental.exportExtensions) option.plugins.push('exportExtensions');
      if (experimental.dynamicImport) option.plugins.push('dynamicImport');
    }

    return option;
  }
}
exports.default = ESParser;