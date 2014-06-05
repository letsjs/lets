'use strict';

module.exports = exports = [
  'first',
  'connect',
  'deploy:setup',
  'disconnect',
  'last'
];

exports.error = [
  'deploy:abort_setup',
  'disconnect',
  'last'
];
