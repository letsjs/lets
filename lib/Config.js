'use strict';

var util = require('util'),
    Base = require('./Base'),
    Config;


/**
 * The Config class is the interface for a Letsfile.
 *
 * @constructor
 * @api public
 */

module.exports = exports = Config = function Config () {
  // Extend Base class
  return Base.call(this, null, Config, '_stages');
};


/*
 * Inherit Base prototype
 */

util.inherits(Config, Base);


/*
 * Expose models
 */

Config.prototype.Stage = require('./Stage');
Config.prototype.Server = require('./Server');


/**
 * Add an stage to the task configuration.
 *
 * @param name (String) The name of the stage.
 * @param options (Object) Stage-specific options.
 *
 * @return (Object|Stage) The stage instance.
 *
 * @api public
 */

Config.prototype.addStage = function(name, stage) {
  return this._addInstanceToCollection(stage, name);
};
