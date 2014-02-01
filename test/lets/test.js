'use strict';

/*global it:true, describe:true*/
/*jshint unused:false*/

var should = require('should'),
    sinon = require('sinon'),
    lets = require('../../.'),
    Letsfile = require('./Letsfile'),
    config;


/* Mocks and reference variables
============================================================================= */

exports.onTest = sinon.spy(function (options) {
  // Test options here some day
});


exports.stageConfig = {
  deployPath: '/var/lets/testApp',
  branch: 'test'
};

exports.serverConfig = {
  host: 'localhost',
  username: 'root',
  password: '******'
};


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

  it('should have a server added', function () {
    config._stages.testing._servers.length.should.equal(1);
  });

  describe('\'s first server', function () {
    it('should have the correct options set', function () {
      config._stages.testing._servers[0]._options
        .should.have.properties(exports.serverConfig);
    });
  });
});

describe('After tasks are run,', function () {
  before(function (done) {
    lets.runTasks(config, 'test', 'testing', done);
  });

  describe('the "test" event', function () {
    it('have been emitted', function () {
      exports.onTest.calledOnce.should.equal(true);
    });
  });
});
