'use strict';

module.exports = [
  'first',
  'connect',
  'deploy:check',
  'disconnect',
  'last'
];

exports.error = [
  'deploy:abort_check',
  'disconnect',
  'last'
];
