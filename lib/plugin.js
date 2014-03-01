'use strict';

/**
 * Shall be used by plugins when exposing a function to be used in a Letsfile.
 * It enables plugins to get plugin-specific options supplied to its tasks,
 * without extra effort.
 *
 * @param callback (Function) The main function of the plugin (eg where stuff
 *  like .on is called).
 * @return (Function) The function which will be exposed to the Letsfile
 * @api public
 */

module.exports = function plugin (callback) {
  return function pluginOptions (options) {
    return {
      options: options,
      callback: callback
    };
  };
};
