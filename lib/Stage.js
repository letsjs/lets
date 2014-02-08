'use strict';

var util = require('util'),
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

module.exports = exports = Stage = function Stage (options) {
  if(!(this instanceof Stage)) {
    return new Stage(options);
  }

  // Extend Base class
  Base.call(this, options, '_servers');
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

Stage.prototype.addServer = Stage.prototype._addInstanceToCollection;
