'use strict';

/**
 * Unit tests for setConnection and getConnection
 */


/*global it:true, describe:true, before:true*/
/*jshint unused:false*/

var
    sinon = require('sinon'),
    lets = require('../../.'),
    utils = require('../../lib/utils'),
    Letsfile = require('./Letsfile'),
    server = new lets.Server();


/* Spies
============================================================================= */

exports.connection = sinon.spy();
sinon.spy(server, 'setConnection');
sinon.spy(server, 'getConnection');


/* Tests
============================================================================= */

describe('setConnection', function () {
  it('should add the connection to the instance when called', function () {
    server.setConnection(exports.connection);
    server.should.have.property('_connection').and.equal(exports.connection);
  });

  it('should throw when called again', function () {
    server.setConnection.bind(server, sinon.spy()).should.throw(Error, /^Tried.*/);
  });

  it('should be chainable', function () {
    server.setConnection.alwaysReturned(server);
  });
});

describe('getConnection', function () {
  it('should fetch the connection', function () {
    var callback = sinon.spy;

    server.getConnection(callback);
    callback.alwaysCalledWithExactly(exports.connection);
  });

  it('should be chainable', function () {
    server.getConnection.alwaysReturned(server);
  });
});
