'use strict';

var async = require('async'),
    utils = require('./utils');

exports.pkg = require('../package');
exports.Base = require('./Base');
exports.Config = require('./Config');
exports.Stage = require('./Stage');
exports.Server = require('./Server');
exports.plugin = require('./plugin');
exports.logger = utils.logger;


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

  exports.migrateStageEventListeners(config);

  return config;
};


/**
 * Move event listeners on stages to the servers. The initial plan was to just
 * call them on the stage with the servers options as argument, but that screwed
 * up the context of the callbacks. To modify stage.on to add the listener to
 * the stage's servers would complicate things when servers are added later.
 * This chosen solution allows for a convenient way to add a listener to
 * all servers while yet calling them with the correct context. And any related
 * fuckups should be contained in this very (perhaps inefficent) function.
 *
 * @param config (Config) A loaded Config
 * @api private
 */

exports.migrateStageEventListeners = function (config) {
  var stages = config._stages;

  Object.keys(stages).forEach(function (stageName) {
    var stage = stages[stageName];

    stage._servers.forEach(function (server) {
      Object.keys(stage._events).forEach(function (type) {
        var eventListeners = stage._events[type];

        eventListeners = Array.isArray(eventListeners) ? eventListeners : [eventListeners];

        eventListeners.forEach(function (listener) {
          // Move stage event listener to server
          server.on(type, listener);
        });
      });
    });

    // Clean away old events to avoid confusion, only if they were moved
    if(stage._servers.length) {
      stage._events = {};
    }
  });
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

exports.runTasks = function (config, task, stageName, callback) {
  var stage = config._stages[stageName],
      configOptions = utils.merge({}, config._options),
      stageOptions = utils.merge({}, config._options, stage._options),
      tasks = exports.getTaskFlow(task);

  if(stage._servers.length) {
    // This is run when there are servers on the stage
    async.eachSeries(tasks, function (task, next) {
      exports.logger.info('\nRunning task ' + task);

      async.series([
        config.emit.bind(config, task, configOptions),
        function (next) {
          async.eachSeries(stage._servers, function (server, next) {
            var options = utils.merge({}, stageOptions, server._options);

            async.series([
              function (next) {
                exports.logger.info('  on server ' + server._options.host);
                next();
              },
              server.emit.bind(server, task, options)
            ], next);
          }, next);
        }
      ], next);
    }, done);
  }
  else {
    // This is run when there are no servers
    async.eachSeries(tasks, function (task, next) {
      exports.logger.info('\nRunning task ' + task);
      exports.logger.info('  globally');

      async.series([
        config.emit.bind(config, task, configOptions),
        function (next) {
          exports.logger.info('  on stage ' + stage._name);
          next();
        },
        stage.emit.bind(stage, task, stageOptions)
      ], next);
    }, done);
  }

  function done (err) {
    if(err) {
      exports.logger.error(err);
    }

    callback(err);
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
