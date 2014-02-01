'use strict';

var utils = require('./utils'),
    Server;


/**
 * A servers should be attached to an Evironment and contains options for each
 * particular server.
 *
 * @param options (Object) Configuration, eg host and stuff, for the server
 */

module.exports = exports = Server = function Server (options) {
  this._options = utils.extend({}, options);
};
