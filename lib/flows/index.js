'use strict';

exports.flows = {
  'deploy': require('./deploy'),
  'deploy:setup': require('./setup'),
  'deploy:check': require('./check'),
  'deploy:rollback': require('./rollback'),
  'deploy:cleanup': require('./cleanup')
};

exports.afters = {};


/*
 * A flow is a chain of events that should be emitted for a pre-defined task.
 * For example it makes sense if all remotely executed dasks (eg deploy)
 * connect on a `connect`-event. Currently Lets ships with some fundamental
 * flows, such as deploy and rollback. Hopefully there will be an API for adding
 * custom ones in the future. Meanwhile if you feel the need to add your own
 * flows or add events to exisiting flows, take care to include the default ones
 * where it makes sense, to maximise future plugin intercompatibility.
 *
 * Generally, `first` should always be first, as `last` should be last. If using
 * remote tasks, set `connect` and `disconnect`.
 */


/**
 * Compose a set of events to emit for the given task.
 *
 * @param task (String) The task
 * @return (Array) The events
 * @api private
 */

exports.get = function (task) {
  return expand(exports.flows[task] || [task]);
};


/**
 * Add a set of events to be emitted for the given task.
 *
 * @param task (String) The task
 * @param events (Array) The events
 * @return exports
 *
 * @api public
 * @since 0.0.7
 */

exports.add = function (task, events) {
  if(!Array.isArray(events)) {
    throw new TypeError('The second argument must be an array');
  }

  if(exports.flows[task]) {
    throw new Error('Flow ' + task + ' already exists');
  }

  exports.flows[task] = events;

  return exports;
};


/**
 * Remove a flow
 *
 * @param task (String) The task the flow belongs to
 * @return exports
 *
 * @api public
 * @since 0.0.7
 */

exports.remove = function (task) {
  delete exports.flows[task];

  return exports;
};


/**
 * Get the error-flow for a flow
 *
 * @param task (String) The task the flow belongs to
 * @return (Array) The flow
 *
 * @api public
 * @since 0.0.7
 */

exports.getError = function (task) {
  if(!exports.flows[task]) {
    throw new Error('Cannot get error-flow for non-existing flow ' + task);
  }

  return expand(exports.flows[task].error || []);
};


/**
 * After a task, also emit another task.
 *
 * @param task (String) Target task
 * @param also (String) New task
 *
 * @api public
 * @since 0.0.8
 */


exports.after = function (task, also) {
  if(!exports.afters[task]) {
    exports.afters[task] = [];
  }

  exports.afters[task].push(also);

  return exports;
};


/* Private helpers
============================================================================= */

function expand (flow) {
  var result = [];

  flow.forEach(function (event) {
    result.push(event + '.pre', event, event + '.post');

    if(exports.afters[event]) {
      result.push.apply(result, expand(exports.afters[event]));
    }
  });

  return result;
}