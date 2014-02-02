'use strict';

var AsyncEventEmitter = require('async-eventemitter'),
    util = require('util'),
    utils = require('./utils'),
    Server = require('./Server'),
    Stage;


/**
 * Creates a new stage (what you call eg "staging" or "production").
 *
 * @param name (String) The name of the stage. Unused atm.
 * @param options (Object) An object containing options for tasks run on it.
 *
 * @constructor
 * @api public
 */

module.exports = exports = Stage = function Stage (name, options) {
  // Extend AsyncEventEmitter
  AsyncEventEmitter.call(this);

  this.name = name;
  this._servers = [];
  this._options = utils.extend({}, options);
};


/**
 * Inherit AsyncEventEmitter prototype
 */

util.inherits(Stage, AsyncEventEmitter);


/**
 * Add a server to the stage
 *
 * @param options (Object) Configuration, eg host and stuff, for the server
 */

Stage.prototype.addServer = function (options) {
  this._servers.push(new Server(options));

  return this;
};
