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
  var stage = config._stages[stageName],
      stageOptions = utils.merge({}, config._options, stage._options);

  if(stage._servers.length) {
    async.each(stage._servers, function (server, next) {
      var options = utils.merge({}, stageOptions, server._options);

      async.series([
        stage.emit.bind(stage, task + '.pre', options),
        server.emit.bind(server, task + '.pre', options),

        stage.emit.bind(stage, task, options),
        server.emit.bind(server, task, options),

        stage.emit.bind(stage, task + '.post', options),
        server.emit.bind(server, task + '.post', options)
      ], next);
    }, done);
  }
  else {
    stage.emit(task, stageOptions, done);
  }
};
