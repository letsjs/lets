'use strict';

var lets = require('../../.'),
    test = require('./test');

exports.test = lets.plugin(function (stage) {
  stage.on('test', test.pluginOnTest);
});
