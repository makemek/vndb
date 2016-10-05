const DEFAULT_VALUES = {
  type: 'character',
  flags: ['basic', 'details', 'meas', 'traits'],
  filters: 'id >= 1',
};

function character(optionsArg = {}) {
  const options = Object.assign({}, optionsArg);
  options.type = DEFAULT_VALUES.type;
  options.flags = options.flags || DEFAULT_VALUES.flags;
  options.filters = options.filters || DEFAULT_VALUES.filters;
  return this.get(options);
}

module.exports = character;
