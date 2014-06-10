'use strict';

var AsyncEventEmitter = require('async-eventemitter'),
    util = require('util'),
    utils = require('./utils'),
    Base;


/**
 * The base class containing a common prototype for Config, Stage and Server.
 * Will create a new instance without the `new` keyword.
 *
 * @param options (Object) Extends this._options
 * @param Class (Function) The class that inherits this Class
 * @param collection (String) Name of the property where sub-instances are added
 *
 * @constructor
 * @api private
 */

module.exports = exports = Base = function Base (options, Class, collection) {
  if(!(this instanceof Class)) {
    return new Class(options, Class, collection);
  }

  // Extend AsyncEventEmitter
  AsyncEventEmitter.call(this);

  // Set a custom collection property for semantics and a standard reference for
  // abstraction
  this[collection] = this._collection = [];

  this._options = utils.merge({}, options);
  this._connection = null;
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

Base.prototype.config = function (options) {
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
 * @param [name] (Object) Name of the instance. If set, the instance will be set
 *  as this._collection[name] instead of pushed to it.
 * @api private
 */

Base.prototype._addInstanceToCollection = function (instance, name) {
  if(name) {
    // [TODO] throw if it already exists?
    this._collection[name] = instance;
  }
  else {
    this._collection.push(instance);
  }

  return this;
};


/**
 * Let a module plug it self into this instance. This function hijacks Base#on
 * before calling the supplied callback with the supplied callbacks extended on
 * top of this instance's and it parents' options. This way neither the plugin 
 * nor the Letsfile have to worry about options extention. As it happens,
 * there's the lets.plugin wrapper which generates such an object.
 *
 * @param plugin (Object)
 *  @param callback (Function) The main function of the plugin
 *  @param options (Object) Options which the plugin-specific options will be
 *   extended on.
 *
 * @api public
 */

Base.prototype.plugin = function (plugin) {
  // Hijack .on to enable plugin-specific options-overriding
  this.on = function (event, callback) {
    Base.prototype.on.call(this, event, function (options, next) {
      var err = callback.call(this, utils.extend({}, options, plugin.options), next);

      if(callback.length < 2) {
        next(err);
      }
    });
  };

  // Execute plugin
  plugin.callback(this, plugin.options);

  // Restore .on
  delete this.on;

  return this;
};


Base.prototype.setConnection = function(connection) {
  if(this._connection) {
    throw new Error('Tried to set a connection when there already was one');
  }

  this._connection = connection;

  return this;
};


Base.prototype.getConnection = function(callback) {
  callback(this._connection);
  return this;
};
