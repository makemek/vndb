'use strict';

const DEFAULT_VALUES = {
  type: 'vn',
  flags: ['basic', 'details', 'anime', 'relations', 'tags', 'stats', 'screens'],
  filters: 'id >= 1',
};

function vn(optionsArg = {}) {
  const options = Object.assign({}, optionsArg);
  options.type = DEFAULT_VALUES.type;
  options.flags = options.flags || DEFAULT_VALUES.flags;
  options.filters = options.filters || DEFAULT_VALUES.filters;
  return this.get(options);
}

module.exports = vn;
