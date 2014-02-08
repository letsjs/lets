'use strict';

var util = require('util'),
    Base = require('./Base'),
    Server;


/**
 * A servers should be attached to an Evironment and contains options for each
 * particular server.
 *
 * @param options (Object) Configuration, eg host and stuff, for the server
 *
 * @constructor
 * @api public
 */

module.exports = exports = Server = function Server (options) {
  // Extend Base class
  return Base.call(this, options, Server);
};


/*
 * Inherit Base prototype
 */

util.inherits(Server, Base);
