'use strict';

// [NOTE] This code does not have any tests. Not that it does really does 
// anything that EventEmitter shouldn't already be testing, but keep it in mind.

var events = require('events');


/* Extend EventEmitter
============================================================================= */

module.exports = exports = new events.EventEmitter();


/* Public methods
============================================================================= */

/**
 * This level of messages should be used for messages that might be helpful when
 * debugging errors, but are only clutter otherwise. Feel free to log anything
 * and everything that might help debugging. The UI should only output this in
 * verbose mode.
 *
 * @param prefix (String) Message prefix. Preferably the name of the dispatching
 *  module
 * @param message (String) The message to log
 * @api public
 */

exports.debug = exports.emit.bind(exports, 'debug');


/**
 * This level should be used for messages informing the user of where in the
 * process/task we are. For example "running command 'git clone xxx'" is okay;
 * proxying the output of the same command is not and should be kept to debug.
 *
 * @param prefix (String) Message prefix. Preferably the name of the dispatching
 *  module
 * @param message (String) The message to log
 * @api public
 */

exports.info = exports.log = exports.emit.bind(exports, 'info');


/**
 * This level should be used for urgent messages that are not critical. For
 * example deprecation notices. The UI might highlight the output in some way.
 *
 * @param prefix (String) Message prefix. Preferably the name of the dispatching
 *  module
 * @param message (String) The message to log
 * @api public
 */

exports.warn = exports.emit.bind(exports, 'warn');


/**
 * This level should be used for messages about errors that are so critical that
 * the task must abort and possibly rollback. It's used internally when an error
 * is passed to an event callback. If used manually, it should be followed by a
 * termination of the task. The UI should highlight this message in some way.
 * The UI should output this even if in quiet mode.
 *
 * @param prefix (String) Message prefix. Preferably the name of the dispatching
 *  module
 * @param message (String) The message to log
 * @api public
 */

exports.error = exports.emit.bind(exports, 'error');
