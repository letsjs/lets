'use strict';

var util = require('util'),
    Server = require('./Server'),
    Base = require('./Base'),
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
  Base.call(this, options, '_servers');

  this.name = name;
};


/**
 * Inherit Base prototype
 */

util.inherits(Stage, Base);


/**
 * Add a server to the stage
 *
 * @param options (Object) Configuration, eg host and stuff, for the server
 */

Stage.prototype.addServer = function (options) {
  this._addInstanceToCollection(new Server(options));

  return this;
};
