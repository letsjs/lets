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
 * Run tasks after they've been specified in a Letsfile. Events on Config are
 * emitted first and once for each task. If there are Servers, the event will be
 * emitted once for each Server on the Stage it belongs to, and once for each
 * Server on the Server itself. If there are no Servers on the Stage, the event
 * will be emitted once on the Stage.
 *
 * Each event is emitted once for each relevant "level" in turn, before moving
 * on to the next one. Eg config->test, development->test, server1->test,
 * config->test.post ...
 *
 * The options emitted for each event are merged from each underlying "level".
 * A listener on a Server would get a merge of the global Config, its Stage, and 
 * its own options object. A listener on Config would simply get the options
 * object of Config.
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
      configOptions = utils.merge({}, config._options),
      stageOptions = utils.merge({}, config._options, stage._options),
      tasks = exports.getTaskFlow(task);

  if(stage._servers.length) {
    // This is run when there are servers on the stage
    async.each(tasks, function (task, next) {
      async.series([
        config.emit.bind(config, task, configOptions),
        function (next) {
          async.each(stage._servers, function (server, next) {
            var options = utils.merge({}, stageOptions, server._options);

            async.series([
              stage.emit.bind(stage, task, options),
              server.emit.bind(server, task, options)
            ], next);
          }, next);
        }
      ], next);
    }, done);
  }
  else {
    // This is run when there are no servers
    async.each(tasks, function (task, next) {
      async.series([
        config.emit.bind(config, task, configOptions),
        stage.emit.bind(stage, task, stageOptions)
      ], next);
    }, done);
  }
};


/**
 * Compose a set of events to emit for the given task.
 *
 * @param task (String) The task
 * @return (Array) The events
 * @api private
 */

exports.getTaskFlow = function (task) {
  return [task + '.pre', task, task + '.post'];
};
