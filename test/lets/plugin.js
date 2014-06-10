'use strict';

var sinon = require('sinon');
var lets = require('../../.');
var test = require('./test');

exports.testableCallback = sinon.spy(function (stage) {
  stage.on('test', test.pluginOnTest);
});

exports.test = lets.plugin(exports.testableCallback);
