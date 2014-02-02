'use strict';

var async = require('async'),
    utils = require('./utils');

exports.Config = require('./Config');


/**
 * Load a Letsfile and create a config object.
 *
 * @param letsfile (Function) A required Letsfile
 * @return (Function) A config object (see ./Config)
 *
 * @api public
 */

exports.load = function (letsfile) {
  var config = new exports.Config();

  letsfile(config);

  return config;
};


/**
 * Run tasks after they've been specified in a Letsfile
 *
 * @param config (Object) An instance of ./Config
 * @param task (String) Name of the task to be run
 * @param stage (String) Name of the stage on which the task will be run
 * @param done (Function) Callback when task execution is done
 * @callback err (null|Object) Any error returned by any task
 *
 * @api public
 */

exports.runTasks = function (config, task, stageName, done) {
  var stage = config._stages[stageName];

  if(stage._servers.length) {
    async.each(stage._servers, function (server, next) {
      stage.emit(task, utils.extend(
        {}, stage._options, server._options), next);
    }, done);
  }
  else {
    stage.emit(task, utils.extend({}, stage._options), done);
  }
};
