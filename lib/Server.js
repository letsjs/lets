'use strict';

var util = require('util'),
    Base = require('./Base'),
    Server;


/**
 * A servers should be attached to an Evironment and contains options for each
 * particular server.
 *
 * @param options (Object) Configuration, eg host and stuff, for the server
 */

module.exports = exports = Server = function Server (options) {
  if(!(this instanceof Server)) {
    return new Server(options);
  }

  // Extend Base class
  Base.call(this, options);
};


/*
 * Inherit Base prototype
 */

util.inherits(Server, Base);
