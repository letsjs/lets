'use strict';

var AsyncEventEmitter = require('async-eventemitter'),
    util = require('util'),
    Config;


/**
 * The Config class is the interface for a Letsfile.
 *
 * @constructor
 * @api public
 */

module.exports = exports = Config = function Config () {
  // Extend AsyncEventEmitter
  AsyncEventEmitter.call(this);

  this._stages = {};
};

// Inherit AsyncEventEmitter prototype
util.inherits(Config, AsyncEventEmitter);


/*
 * Expose models for testability
 */

Config.prototype.models = {};
Config.prototype.models.Stage = require('./Stage');


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

Config.prototype.addStage = function(name, options) {
  // [TODO] throw if it already exists?
  var newEnv = this._stages[name] = new this.models.Stage(name, options);

  return newEnv;
};
