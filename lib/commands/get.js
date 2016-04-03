'use strict';

function _fixFilters(filters) {
  let result = filters;

  if (filters[0] !== '(') {
    result = `(${result}`;
  }
  if (filters[filters.length - 1] !== ')') {
    result = `${result})`;
  }

  return result;
}

function get(type, flags, filters, options) {
  return new Promise((resolve, reject) => {
    const modifiers = [type, flags, _fixFilters(filters)];
    this.emit('queue', 'get', modifiers, options, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}

module.exports = get;
