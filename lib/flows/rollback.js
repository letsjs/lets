'use strict';

module.exports = exports = [
  'first',
  'connect',
  'deploy:start',
  'deploy:rollback',
  'deploy:publish',
  'deploy:finish_rollback',
  'disconnect',
  'last'
];

exports.error = [
  'deploy:abort_rollback',
  'disconnect',
  'last'
];
