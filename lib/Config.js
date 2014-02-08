'use strict';

var AsyncEventEmitter = require('async-eventemitter'),
    util = require('util'),
    utils = require('./utils'),
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
  this._options = {};
};

// Inherit AsyncEventEmitter prototype
util.inherits(Config, AsyncEventEmitter);


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
  // [TODO] throw if it already exists?
  var newEnv = this._stages[name] = stage;

  return newEnv;
};


/**
 * Set config-wide options. Default options for all Stages and Servers.
 * Options set here will be overridden for each Stage/Server.
 *
 * @param options (Object) General configuration
 */

Config.prototype.config = function(options) {
  utils.extend(this._options, options);

  return this;
};
