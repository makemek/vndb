'use strict';

const ERROR_MESSAGES = {
  options: 'client.get(options) options must be of type object.',
  type: 'client.get(options) options.type must be a non-empty string.',
  flags: 'client.get(options) options.flags must be a non-empty string or array.',
  filters: 'client.get(options) options.filters must be a non-empty string.',
};

const VALID_EXTRA_OPTIONS = ['page', 'results', 'sort', 'reverse'];

function _parseType(typeArg = '') {
  if (typeof typeArg !== 'string' || typeArg.length === 0) {
    throw new Error(ERROR_MESSAGES.type);
  }

  return typeArg;
}

function _parseFlags(flags = '') {
  if (typeof flags !== 'string' && !Array.isArray(flags)) {
    throw new Error(ERROR_MESSAGES.flags);
  }
  if (flags.length === 0) {
    throw new Error(ERROR_MESSAGES.flags);
  }

  const result = Array.isArray(flags) ? flags.join(',') : flags;
  return result;
}

function _parseFilters(filters = '') {
  if (typeof filters !== 'string' || filters.length === 0) {
    throw new Error(ERROR_MESSAGES.filters);
  }

  let result = filters;
  result = result[0] === '(' ? result : `(${result}`;
  result = result[result.length - 1] === ')' ? result : `${result})`;

  return result;
}

function _parseExtraOptions(options = {}) {
  let result = {};

  VALID_EXTRA_OPTIONS.forEach((key) => {
    if (options[key]) {
      result[key] = options[key];
    }
  });

  if (Object.keys(result).length === 0) {
    result = '';
  } else {
    result = JSON.stringify(result);
  }

  return result;
}

function get(options = {}) {
  if (typeof options !== 'object') throw new Error(ERROR_MESSAGES.options);

  const parsedType = _parseType(options.type);
  const parsedFlags = _parseFlags(options.flags);
  const parsedFilters = _parseFilters(options.filters);
  const parsedOptions = _parseExtraOptions(options);

  const message = `get ${parsedType} ${parsedFlags} ${parsedFilters} ${parsedOptions}`;
  return this.execute(message);
}

module.exports = get;
