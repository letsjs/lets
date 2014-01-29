'use strict';

/*
 * This is is a Letsfile for test Letsfiles.
 * This file is loaded by ./test.js, where the assertion functions,
 * and mock tasks are defined. Things are simply added here and tested there,
 * due to the async nature of it()s and sync nature of lets.
 */

/*global it:true, describe:true*/

var test = require('./test');


module.exports = function (lets) {
  var testing;

  testing = lets.addStage('testing', test.stageConfig);

  testing.on('test', test.onTest);
};
