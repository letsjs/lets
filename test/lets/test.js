'use strict';

/*global it:true, describe:true*/
/*jshint unused:false*/

var should = require('should'),
    sinon = require('sinon'),
    lets = require('../../.'),
    utils = require('../../lib/utils'),
    Letsfile = require('./Letsfile'),
    config;


/* Mocks and reference variables
============================================================================= */

var onTestOptions = [],
  onTestOptions2 = [];

exports.onTest = sinon.spy(function (options) {
  // Expose options so they can be tested
  onTestOptions.push(options);
});

exports.onTest2 = sinon.spy(function (options) {
  onTestOptions2.push(options);
});


exports.stageConfig = {
  deployPath: '/var/lets/testApp',
  branch: 'test'
};

exports.serverConfigs = [
  {
    branch: 'test2',
    host: 'localhost',
    username: 'root',
    password: '******'
  },
  {
    branch: 'test3',
    host: 'localhost:1337',
    username: 'root',
    password: '******'
  }
];


/* Lets test stuff!
============================================================================= */

// Run the config setup
config = lets.load(Letsfile);

describe('Stage "testing"', function () {
  it('should have been added to the config object', function () {
    config._stages.should.have.property('testing');
  });

  it('should have the correct options set', function () {
    config._stages.testing._options.should.eql(exports.stageConfig);
  });

  it('should have n servers added', function () {
    config._stages.testing._servers.length
      .should.equal(exports.serverConfigs.length);
  });

  describe('\'s servers', function () {
    it('should have the correct options set', function () {
      config._stages.testing._servers.forEach(function (server, i) {
        server._options.should.eql(exports.serverConfigs[i]);
      });
    });
  });
});

describe('After tasks are run on Stage "testing",', function () {
  before(function (done) {
    lets.runTasks(config, 'test', 'testing', done);
  });

  describe('the "test" event', function () {
    it('was emitted once per server', function () {
      exports.onTest.callCount
        .should.equal(config._stages.testing._servers.length);
    });

    it('was emitted with the right options', function () {
      onTestOptions.forEach(function (options, i) {
        options.should.eql(
          utils.extend({}, exports.stageConfig, exports.serverConfigs[i]));
      });
    });
  });
});

describe('After tasks are run on Stage "testing2",', function () {
  before(function (done) {
    lets.runTasks(config, 'test', 'testing2', done);
  });

  describe('the "test" event', function () {
    it('was emitted once', function () {
      exports.onTest2.callCount
        .should.equal(1);
    });

    it('was emitted with the right options', function () {
      onTestOptions2[0].should.eql(utils.extend({}, exports.stageConfig));
    });
  });
});

