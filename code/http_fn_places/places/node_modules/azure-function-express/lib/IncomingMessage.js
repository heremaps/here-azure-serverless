"use strict";

exports.__esModule = true;
exports.default = void 0;

var _events = _interopRequireDefault(require("events"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const NOOP = () => {};

function removePortFromAddress(address) {
  return address ? address.replace(/:[0-9]*$/, "") : address;
}
/**
 * Create a fake connection object
 *
 * @param {Object} context Raw Azure context object for a single HTTP request
 * @returns {object} Connection object
 */


function createConnectionObject(context) {
  const {
    req
  } = context.bindings;
  const xForwardedFor = req.headers ? req.headers["x-forwarded-for"] : undefined;
  return {
    encrypted: req.originalUrl && req.originalUrl.toLowerCase().startsWith("https"),
    remoteAddress: removePortFromAddress(xForwardedFor)
  };
}
/**
 * Copy usefull context properties from the native context provided by the Azure Function engine
 *
 * See:
 * - https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference-node#context-object
 * - https://github.com/christopheranderson/azure-functions-typescript/blob/master/src/context.d.ts
 *
 * @param {Object} context Raw Azure context object for a single HTTP request
 * @returns {Object} Filtered context
 */


function sanitizeContext(context) {
  const sanitizedContext = _extends({}, context, {
    log: context.log.bind(context)
  }); // We don't want the developper to mess up express flow
  // See https://github.com/yvele/azure-function-express/pull/12#issuecomment-336733540


  delete sanitizedContext.done;
  return sanitizedContext;
}
/**
 * Request object wrapper
 *
 * @private
 */


class IncomingMessage extends _events.default {
  /**
   * Note: IncomingMessage assumes that all HTTP in is binded to "req" property
   *
   * @param {Object} context Sanitized Azure context object for a single HTTP request
   */
  constructor(context) {
    super();
    Object.assign(this, context.bindings.req); // Inherit

    this.url = this.originalUrl;
    this.headers = this.headers || {}; // Should always have a headers object

    this._readableState = {
      pipesCount: 0
    }; // To make unpipe happy

    this.resume = NOOP;
    this.socket = {
      destroy: NOOP
    };
    this.connection = createConnectionObject(context);
    this.context = sanitizeContext(context); // Specific to Azure Function
  }

}

exports.default = IncomingMessage;
module.exports = exports["default"];