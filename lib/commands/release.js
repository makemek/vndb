'use strict';

const DEFAULT_VALUES = {
  type: 'release',
  flags: ['basic', 'details', 'vn', 'producers'],
  filters: 'id >= 1',
};

function release(optionsArg = {}) {
  const options = Object.assign({}, optionsArg);
  options.type = DEFAULT_VALUES.type;
  options.flags = options.flags || DEFAULT_VALUES.flags;
  options.filters = options.filters || DEFAULT_VALUES.filters;
  return this.get(options);
}

module.exports = release;
