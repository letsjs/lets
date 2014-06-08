'use strict';

/**
 * Unit tests for adding custom flows
 */


/*global it:true, describe:true, before:true*/
/*jshint unused:false*/


var expect = require('chai').expect;
var lets = require('../../.');

var testFlow = ['test:1', 'test:2'];
var extraTask = 'test:3';
var extraTask2 = 'test:4';
var existingFlow = 'existing';
var nonExistingFlow = 'non-existing';

testFlow.error = ['test:error1', 'test:error1'];


/* Tests
============================================================================= */

describe('lets.flows', function () {
  describe('.get()', function () {
    describe('non-existing flow', function () {
      it('should give a "pre-flow-post" flow anyway', function () {
        var test = lets.flows.get(nonExistingFlow);

        test.length.should.equal(3);
        test[0].should.equal(nonExistingFlow + '.pre');
        test[1].should.equal(nonExistingFlow);
        test[2].should.equal(nonExistingFlow + '.post');
      });
    });
  });

  describe('.add()', function () {
    it('should be chainable', function () {
      lets.flows.add(existingFlow, testFlow).should.equal(lets.flows);
    });

    describe('new flow', function () {
      it('should have added the flow', function () {
        lets.flows.get(existingFlow).should.have.length(testFlow.length * 3);
      });
    });

    describe('existing flow', function () {
      it('should throw', function () {
        expect(lets.flows.add.bind(lets.flows, existingFlow, [])).to.throw(Error);
      });
    });

    describe('invalid array', function () {
      it('should throw', function () {
        expect(lets.flows.add.bind(lets.flows, '', 'for teh lulz'))
          .to.throw(TypeError);
        expect(lets.flows.add.bind(lets.flows, '', 1))
          .to.throw(TypeError);
        expect(lets.flows.add.bind(lets.flows, '', {}))
          .to.throw(TypeError);
        expect(lets.flows.add.bind(lets.flows, ''))
          .to.throw(TypeError);
      });
    });
  });

  describe('.getError()', function () {
    describe('existing flow with error', function () {
      it('should get the error flow', function () {
        lets.flows.getError(existingFlow)
          .should.have.length(testFlow.error.length * 3);
      });
    });

    describe('existing flow without error', function () {
      it('should get an empty array', function () {
        /*jshint expr:true*/
        lets.flows.add('empty', []);
        lets.flows.getError('empty')
          .should.be.instanceOf(Array)
          .and.be.empty;
      });
    });

    describe('non-existing flow', function () {
      it('should throw', function () {
        expect(lets.flows.getError.bind(lets.flows, nonExistingFlow))
          .to.throw('Cannot get error-flow for non-existing flow ' + nonExistingFlow);
      });
    });
  });

  describe('.after()', function () {
    it('should be chainable', function () {
      lets.flows.after(testFlow[1], extraTask).should.equal(lets.flows);
    });

    describe('for existing event', function () {
      // (Added above)
      it('should add the new event after the target event', function () {
        var flow = lets.flows.get(existingFlow);

        flow.indexOf(extraTask).should.be.greaterThan(-1);
        flow.indexOf(extraTask + '.pre').should.be.greaterThan(-1);
        flow.indexOf(extraTask + '.post').should.be.greaterThan(-1);
      });
    });

    describe('for existing event again', function () {
      it('should add the new event after the existing event', function () {
        lets.flows.after(testFlow[1], extraTask2);

        var flow = lets.flows.get(existingFlow);

        flow.indexOf(extraTask2).should.be.greaterThan(-1)
          .and.greaterThan(flow.indexOf(extraTask));
        flow.indexOf(extraTask2 + '.pre').should.be.greaterThan(-1);
        flow.indexOf(extraTask2 + '.post').should.be.greaterThan(-1);
      });
    });
  });

  describe('.remove()', function () {
    it('should be chainable', function () {
      lets.flows.remove(existingFlow).should.equal(lets.flows);
    });

    describe('existing flow', function () {
      // (Removed above)
      it('should remove the flow', function () {
        lets.flows.get(existingFlow).length.should.equal(3);
      });
    });

    describe('non-existing flow', function () {
      // Nothing in particular needs to happen
    });
  });
});
