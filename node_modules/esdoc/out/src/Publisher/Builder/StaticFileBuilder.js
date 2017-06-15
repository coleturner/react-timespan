'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _DocBuilder = require('./DocBuilder.js');

var _DocBuilder2 = _interopRequireDefault(_DocBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Static file output builder class.
 */
class StaticFileBuilder extends _DocBuilder2.default {
  /**
   * execute build output.
   * @param {function(content: string, filePath: string)} callback - is called with each output.
   */
  exec(callback) {
    callback(_path2.default.resolve(__dirname, './template/css'), './css');
    callback(_path2.default.resolve(__dirname, './template/script'), './script');
    callback(_path2.default.resolve(__dirname, './template/image'), './image');

    // see DocBuilder#_buildLayoutDoc
    const scripts = this._config.scripts || [];
    for (let i = 0; i < scripts.length; i++) {
      const userScript = scripts[i];
      const name = `./user/script/${ i }-${ _path2.default.basename(userScript) }`;
      callback(userScript, name);
    }

    const styles = this._config.styles || [];
    for (let i = 0; i < styles.length; i++) {
      const userStyle = styles[i];
      const name = `./user/css/${ i }-${ _path2.default.basename(userStyle) }`;
      callback(userStyle, name);
    }
  }
}
exports.default = StaticFileBuilder;