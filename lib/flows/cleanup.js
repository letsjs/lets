'use strict';

module.exports = [
  'first',
  'connect',
  'deploy:cleanup',
  'disconnect',
  'last'
];

exports.error = [
  'deploy:abort_cleanup',
  'disconnect',
  'last'
];
