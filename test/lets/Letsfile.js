'use strict';

/*
 * This is is a Letsfile for testing Letsfiles.
 * This file is loaded by ./test.js, where the assertion functions,
 * and mock tasks are defined. Things are simply added here and tested there,
 * due to the async nature of it()s and sync nature of lets.
 */

var test = require('./test'),
    testPlugin = require('./plugin');


module.exports = function (lets) {
  var testing;

  lets.config(test.globalConfig);

  lets.pre('test', test.preConfigTest);

  // Test stage 1, using servers
  testing = new lets.Stage(test.stageConfig);

  testing
    .plugin(testPlugin.test(test.pluginConfig))
    .on('test', test.onTest)
    .pre('test', test.onTestPre)
    .post('test', test.onTestPost)
    .addServer(new lets.Server(test.serverConfigs[0]))
    .addServer(lets.Server()
      .config(test.serverConfigs[1])
      .on('test', test.onServerTest));

  lets.addStage('testing', testing);


  // Test stage 2, not using servers
  lets
    .addStage('testing2', lets.Stage()
      .config(test.stageConfig)
      .on('test', test.onTest2)

      // Testing deploy flow
      .on('first', test.onFirst)
      .on('connect', test.onConnect)
      .on('deploy:start', test.onDeployStart)
      .on('deploy:update', test.onDeployUpdate)
      .on('deploy', test.onDeploy)
      .on('deploy:publish', test.onDeployPublish)
      .on('deploy:finish', test.onDeployFinish)
      .on('disconnect', test.onDisonnect)
      .on('last', test.onLast)
    );


  // Test stage 3, not using servers, callbacks an error
  lets
    .addStage('testing3', lets.Stage()
      .config(test.stageConfig)
      .on('test', test.onTest3));
};
