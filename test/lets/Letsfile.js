'use strict';

/*
 * This is is a Letsfile for testing Letsfiles.
 * This file is loaded by ./test.js, where the assertion functions,
 * and mock tasks are defined. Things are simply added here and tested there,
 * due to the async nature of it()s and sync nature of lets.
 */

/*global it:true, describe:true*/

var test = require('./test');


module.exports = function (lets) {
  var testing,
      testing2;

  // Test stage 1, using servers
  testing = lets.addStage('testing', test.stageConfig);

  testing.on('test', test.onTest);
  testing.addServer(test.serverConfigs[0]);
  testing.addServer(test.serverConfigs[1]);

  // Test stage 2, not using servers
  testing2 = lets.addStage('testing2', test.stageConfig);

  testing2.on('test', test.onTest2);
};
