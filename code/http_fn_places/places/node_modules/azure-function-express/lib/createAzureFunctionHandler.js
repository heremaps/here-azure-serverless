"use strict";

exports.__esModule = true;
exports.default = createAzureFunctionHandler;

var _ExpressAdapter = _interopRequireDefault(require("./ExpressAdapter"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Creates a function ready to be exposed to Azure Function for request handling.
 *
 * @param {Object} requestListener Request listener (typically an express/connect instance)
 * @returns {function(context: Object)} Azure Function handle
 */
function createAzureFunctionHandler(requestListener) {
  const adapter = new _ExpressAdapter.default(requestListener);
  return adapter.createAzureFunctionHandler();
}

module.exports = exports["default"];