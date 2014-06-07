'use strict';

var async = require('async'),
    utils = require('./utils'),
    EventEmitter = require('events').EventEmitter;

exports.pkg = require('../package');
exports.Base = require('./Base');
exports.Config = require('./Config');
exports.Stage = require('./Stage');
exports.Server = require('./Server');
exports.plugin = require('./plugin');
exports.logger = utils.logger;
exports.flows = require('./flows');


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
  var stage = config._stages[stageName];
  var tasks = exports.flows.get(task);

  // If there are no servers on the stage, treat the stage as a server
  var instances = stage._servers.length && stage._servers || [stage];

  // Prepare flow emitter, since it might be called twice with almost the same arguments
  var emitter = emitFlow.bind(null, config, stage, instances);

  // Remove tasks which have no listeners
  // Assuming listeners won't be added during flow execution
  tasks = tasks.filter(function (task) {
    return someHasListeners(config, task) ||
      someHasListeners(instances, task);
  });

  // Finally, run tasks
  emitter(tasks, function (err) {
    if(err) {
      // Emit error flow
      return emitter(exports.flows.getError(task), function () {
        //## Do something with the second level errors here?
        callback(err);
      });
    }

    callback();
  });
};


/* Private helpers
============================================================================= */

/**
 * See .runTasks()
 */

function emitFlow (config, stage, instances, tasks, callback) {
  async.eachSeries(tasks, function (task, next) {
    async.series([
      function (next) {
        // Emit event globally
        if(!EventEmitter.listenerCount(config, task)) {
          return next();
        }

        exports.logger.info('[' + task + ']', 'globally');
        config.emit(task, utils.merge({}, config._options), next);
      },
      function (next) {
        // Emit on each instance (stage or server)
        async.eachSeries(instances, function (instance, next) {
          var name = instance._name || instance._options.host;
          var options = utils.merge({},
            config._options,
            stage._options,
            instance._options);

          exports.logger.info('[' + task + ']', 'on ' + name);
          instance.emit(task, options, next);
        }, next);
      }
    ], next);
  },
  callback);
}


/**
 * Private helper to check a bunch of objects if atleast one of them
 * has a listener for the specified event.
 *
 * @param servers (Array|EventEmitter) The instance(s) to check
 * @param task (String) The task to check on
 * @return (Boolean) True if any listener found
 * @api private
 */

function someHasListeners (servers, task) {
  var i;

  if(!Array.isArray(servers)) {
    servers = [servers];
  }

  for (i = 0; i < servers.length; i++) {
    if(EventEmitter.listenerCount(servers[i], task)) {
      return true;
    }
  }

  return false;
}
