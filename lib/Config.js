'use strict';

var util = require('util');
var Base = require('./Base');
var Stage = require('./Stage');
var Server = require('./Server');
var Config;


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

Config.prototype.Stage = Stage;
Config.prototype.Server = Server;


/**
 * Alias for flows
 */

Config.prototype.flows = require('./flows');


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
  stage._name = name;

  if(!(stage instanceof Stage)) {
    stage = new Stage(stage);
  }

  return this._addInstanceToCollection(stage, name);
};
