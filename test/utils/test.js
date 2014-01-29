'use strict';

/*global it:true, describe:true*/
/*jshint unused:false*/

var should = require('should'),
    utils = require('../../lib/utils');


describe('utils.extend', function () {
  it('should extend an object', function () {
    var obj = utils.extend({
      one: 1
    }, {
      two: 2,
      one: 3
    });

    obj.should.have.property('one').and.equal(3);
    obj.should.have.property('two').and.equal(2);
  });
});
