"use strict";

exports.__esModule = true;

var _createAzureFunctionHandler = _interopRequireDefault(require("./createAzureFunctionHandler"));

exports.createAzureFunctionHandler = _createAzureFunctionHandler.default;
exports.createHandler = _createAzureFunctionHandler.default;

var _ExpressAdapter2 = _interopRequireDefault(require("./ExpressAdapter"));

exports.ExpressAdapter = _ExpressAdapter2.default;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }