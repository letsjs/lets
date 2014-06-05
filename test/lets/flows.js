'use strict';

/**
 * Unit tests for adding custom flows
 */


/*global it:true, describe:true, before:true*/
/*jshint unused:false*/


var expect = require('chai').expect;
var lets = require('../../.');

var testFlow = ['test:1', 'test:2'];
var existingFlow = 'existing';
var nonExistingFlow = 'non-existing';


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
