var util = require('util')
  , events = require('events')
  , Message = require('./message')
  ;

module.exports = Route;

/**
 * Represents a compiled list of functions that will be executed sequentially
 *
 * @return Route
 */

function Route () {
  if (!(this instanceof Route)) return new Route();
  events.EvemtEmitter.call(this);
}

/**
 * executes the list of functions, sequentially given the message
 *
 * @param {Message} message
 */

Route.prototype.process = function (message) {
  if (!(message instanceof Message)) throw new Error('message must be a Message');
  // TODO implement me!
  self.emit('done', message);
};

/**
 * Initializes a list of methods that will invoked
 *
 * @return Array
 */

Route.prototype.list = function () {
  if (!this._list) {
    this._list = [];
  }
  return this._list;
};