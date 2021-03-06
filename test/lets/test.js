'use strict';

/*global it:true, describe:true, before:true*/
/*jshint unused:false*/

var
    chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    lets = require('../../.'),
    utils = require('../../lib/utils'),
    Letsfile = require('./Letsfile'),
    config;

chai.should();
chai.use(sinonChai);


/* Mocks and reference variables
============================================================================= */

var callOrderTest = sinon.spy();

exports.onTest = sinon.spy(function (options, next) {
  setTimeout(function () {
    callOrderTest();
    next();
  }, 100);
});

exports.preConfigTest = sinon.spy();
exports.onTestPre = sinon.spy();
exports.onTestPost = sinon.spy();
exports.onServerTest = sinon.spy();
exports.onTest2 = sinon.spy();

exports.onTest3Error = sinon.spy();
exports.onTest3 = function (_, next) {
  next(new Error('This is an error'));
};


exports.plugin = require('./plugin').test;
exports.pluginOnTest = sinon.spy();
var testablePluginCallback = require('./plugin').testableCallback;


// Flow test spies
exports.onFirst = sinon.spy();
exports.onConnect = sinon.spy();
exports.onDeployStart = sinon.spy();
exports.onDeployUpdate = sinon.spy();
exports.onDeploy = sinon.spy();
exports.onDeployPublish = sinon.spy();
exports.onDeployFinish = sinon.spy();
exports.onDisonnect = sinon.spy();
exports.onLast = sinon.spy();


exports.globalConfig = {
  applicationName: 'Test',
  branch: 'master'
};

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
  },
  {
    branch: 'test4',
    host: 'localhost:1337',
    username: 'root',
    password: '******'
  }
];

exports.pluginConfig = {
  branch: 'pluginBranch',
  pluginSpecific: 'test'
};


/* Lets test stuff!
============================================================================= */

// Run the config setup
config = lets.load(Letsfile);

describe('The global config object', function () {
  it('should have the correct options set', function () {
    config._options.should.eql(exports.globalConfig);
  });
});

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

describe('After "test" tasks are run on Stage "testing",', function () {
  before(function (done) {
    lets.runTasks(config, 'test', 'testing', done);
  });

  describe('the "test" event', function () {
    it('was emitted once per server', function () {
      exports.onTest.callCount
        .should.equal(config._stages.testing._servers.length);

      exports.onServerTest.callCount.should.equal(1);
    });

    it('was emitted with the right options', function () {
      exports.onTest.args.forEach(function (args, i) {
        args[0].should.eql(utils.extend({},
          exports.globalConfig, exports.stageConfig, exports.serverConfigs[i]));
      });
    });

    it('was emitted with the right context', function () {
      config._stages.testing._servers.forEach(function (server) {
        exports.onTest.should.have.been.calledOn(server);
      });
    });
  });

  describe('the "test.pre" event', function () {
    it('was emitted once per server', function () {
      exports.onTestPre.callCount
        .should.equal(config._stages.testing._servers.length);
    });
  });

  describe('the "test.post" event', function () {
    it('was emitted once per server', function () {
      exports.onTestPost.callCount
        .should.equal(config._stages.testing._servers.length);
    });
  });

  describe('the testPlugin', function () {
    it('was called width options as second argument', function () {
      testablePluginCallback.should.have.been.calledWithMatch(
        sinon.match(config._stages.testing), sinon.match(exports.pluginConfig));
    });

    it('listeners were called with the right options', function () {
      exports.pluginOnTest.callCount
        .should.equal(config._stages.testing._servers.length);

      exports.pluginOnTest.firstCall
        .should.have.been.calledWithExactly(
          utils.extend({},
            exports.globalConfig, exports.stageConfig,
            exports.serverConfigs[0], exports.pluginConfig),
          sinon.match.func);
    });

    it('was called with the right context', function () {
      config._stages.testing._servers.forEach(function (server) {
        exports.pluginOnTest.should.have.been.calledOn(server);
      });
    });
  });

  it('the tasks were run in order', function () {
    callOrderTest.should.have.been.calledBefore(exports.onTest);
  });
});

describe('After "test" tasks are run on Stage "testing2",', function () {
  before(function (done) {
    lets.runTasks(config, 'test', 'testing2', done);
  });

  describe('the "test" event', function () {
    it('was emitted once', function () {
      exports.onTest2.callCount
        .should.equal(1);
    });

    it('was emitted with the right options', function () {
      exports.onTest2.args.forEach(function (args, i) {
        args[0].should.eql(utils.extend({},
          exports.globalConfig, exports.stageConfig));
      });
    });
  });
});

describe('After "test" tasks are run on both Stages,', function () {
  describe('the "test" event', function () {
    it('was emitted twice', function () {
      exports.preConfigTest.callCount.should.equal(2);
    });

    it('was emitted with the right options', function () {
      exports.preConfigTest.args.forEach(function (args, i) {
        args[0].should.eql(utils.extend({},
          exports.globalConfig));
      });
    });
  });
});

describe('After "test" tasks are run on Stage "testing3",', function () {
  describe('lets.runTasks', function () {
    before(function () {
      lets.logger.error = sinon.spy();
    });

    it('callbacked an error', function (next) {
      lets.runTasks(config, 'test', 'testing3', function (err) {
        err.should.be.instanceOf(Error);
        next();
      });
    });

    it('ran the error flow', function () {
      /*jshint expr:true*/
      exports.onTest3Error.should.have.been.calledOnce;
    });
  });
});

describe('After "deploy" task have been run on Stage "testing2,"', function () {
  var deployFlow = [
    exports.onFirst,
    exports.onConnect,
    exports.onDeployStart,
    exports.onDeployUpdate,
    exports.onDeploy,
    exports.onDeployPublish,
    exports.onDeployFinish,
    exports.onDisonnect,
    exports.onLast
  ],
  deployFlowNames = [
    'first',
    'connect',
    'deploy:start',
    'deploy:update',
    'deploy',
    'deploy:publish',
    'deploy:finish',
    'disconect',
    'last'
  ], i, l;

  before(function (done) {
    lets.runTasks(config, 'deploy', 'testing2', done);
  });

  // Automate flow test specification
  deployFlow.forEach(function (task, i) {
    describe('the "' + deployFlowNames[i] + '" task', function () {
      it('should have been called once', function () {
        task.should.have.callCount(1);
      });

      if(i > 0) {
        it('should have been called after "' + deployFlowNames[i - 1] + '"', function () {
          task.should.have.been.calledAfter(
            deployFlow[i - 1]);
        });
      }

      if(i + 1 < deployFlow.length) {
        it('should have been called before "' + deployFlowNames[i + 1] + '"', function () {
          task.should.have.been.calledBefore(
            deployFlow[i + 1]);
        });
      }
    });
  });
});


// Run additional tests
require('./connection');
require('./flows');
