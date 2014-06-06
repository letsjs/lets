'use strict';

module.exports = exports = [
  'first',
  'connect',
  'deploy:start',
  'deploy:update',
  'deploy',
  'deploy:publish',
  'deploy:finish',
  'disconnect',
  'last'
];

exports.error = [
  'deploy:abort',
  'disconnect',
  'last'
];
