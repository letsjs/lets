'use strict';

module.exports = function (root) {
  var objs = Array.prototype.slice.call(arguments, 1);
  
  root = root || {};

  objs.forEach(function (obj) {
    if(obj) {
      Object.keys(obj).forEach(function (i) {
        root[i] = obj[i];
      });
    }
  });

  return root;
};
