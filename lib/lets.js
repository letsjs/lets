'use strict';

exports.Config = require('./Config');


exports.load = function (letsfile) {
  var config = new exports.Config();

  letsfile(config);

  return config;
};


exports.runTasks = function (config, task, stage, done) {
  config._stages[stage].emit(task, done);
};
