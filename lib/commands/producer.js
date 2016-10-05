const DEFAULT_VALUES = {
  type: 'producer',
  flags: ['basic', 'details', 'relations'],
  filters: 'id >= 1',
};

function producer(optionsArg = {}) {
  const options = Object.assign({}, optionsArg);
  options.type = DEFAULT_VALUES.type;
  options.flags = options.flags || DEFAULT_VALUES.flags;
  options.filters = options.filters || DEFAULT_VALUES.filters;
  return this.get(options);
}

module.exports = producer;
