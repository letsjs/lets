'use strict';

var AsyncEventEmitter = require('async-eventemitter'),
    util = require('util'),
    utils = require('./utils'),
    Base;


/**
 * The base class containing a common prototype for Config, Stage and Server
 *
 * @constructor
 * @api private
 */

module.exports = exports = Base = function Base (options, collection) {
  // Extend AsyncEventEmitter
  AsyncEventEmitter.call(this);

  // Set a custom collection property for semantics and a standard reference for
  // abstraction
  this[collection] = this._collection = [];

  this._options = utils.extend({}, options);
};


/*
 * Inherit AsyncEventEmitter prototype
 */

util.inherits(Base, AsyncEventEmitter);


/**
 * Set config-wide options. Default options for all Stages and Servers.
 * Options set here will be overridden for each Stage/Server.
 *
 * @param options (Object) General configuration
 */

Base.prototype.config = function(options) {
  utils.extend(this._options, options);

  return this;
};


/**
 * Add a listener to a special *.pre event, that will be automatically be
 * emitted before the main event. Otherwise see async-eventemitter#on().
 *
 * @api public
 */

Base.prototype.pre = function (event, callback) {
  this.on(event + '.pre', callback);

  return this;
};


/**
 * Add a listener to a special *.post event, that will be automatically be
 * emitted after the main event. Otherwise see async-eventemitter#on().
 *
 * @api public
 */

Base.prototype.post = function (event, callback) {
  this.on(event + '.post', callback);

  return this;
};


/**
 * Abstracted interface for #addX(), eg Stage#addServer or Config#addStage,
 * so that they can all use the same interface. The property where it's added
 * is referenced by this._collection.
 *
 * @param instance (Object) The instance to add to this._collection
 * @api private
 */

Base.prototype._addInstanceToCollection = function(instance) {
  this._collection.push(instance);

  return this;
};
