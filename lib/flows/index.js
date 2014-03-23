'use strict';

exports.flows = {
  'deploy': require('./deploy'),
  'deploy:setup': require('./setup'),
  'deploy:rollback': require('./rollback')
};


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
  var flow = exports.flows[task] || [task],
      result = [];

  flow.forEach(function (event) {
    result.push(event + '.pre', event, event + '.post');
  });

  return result;
};
