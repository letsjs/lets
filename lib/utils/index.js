'use strict';

var fs = require('fs'),
    path = require('path'),
    _ = require('lodash');


// Simple exposing of all utilities
fs.readdirSync(__dirname).filter(function (file) {
  return file !== path.basename(__filename) && (path.extname(file) === '.js' ||
    fs.statSync(path.join(__dirname, file)).isDirectory());
}).map(function (file) {
  return path.basename(file, path.extname(file));
}).forEach(function (file) {
  exports[file] = require('./' + file);
});



exports.extend = _.extend.bind(_);
exports.merge = _.merge.bind(_);
