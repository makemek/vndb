'use strict';

const typeErrorMessage = 'Type must be a valid non-empty string!';
function parseType(typeArg) {
  let result = typeArg || '';

  if (typeof result !== 'string' || result.length === 0) {
    result = new Error(typeErrorMessage);
  }

  return result;
}

const flagsErrorMessage = 'Flags must be a valid non-empty string! or a valid non-empty array';
function parseFlags(flags) {
  let result = flags || '';

  if (typeof result === 'string' && result.length === 0) {
    result = new Error(flagsErrorMessage);
  } else if (Array.isArray(result) && result.length === 0) {
    result = new Error(flagsErrorMessage);
  } else if (Array.isArray(result)) {
    result = result.join(',');
  }

  return result;
}

const filtersErrorMessage = 'Filters must be a valid non-empty string!';
function parseFilters(filters) {
  let result = filters || '';

  if (typeof result !== 'string' || result.length === 0) {
    result = new Error(filtersErrorMessage);
  } else {
    result = result[0] === '(' ? result : `(${result}`;
    result = result[result.length - 1] === ')' ? result : `${result})`;
  }

  return result;
}

const optionsErrorMessage = 'Options must be a valid JSON object or an empty string!';
function parseOptions(options) {
  let result = options || '';

  if (result !== '') {
    result = JSON.stringify(result);
    if (result[0] !== '{' || result[result.length - 1] !== '}') {
      result = new Error(optionsErrorMessage);
    }
  }

  return result;
}

function get(typeArg, flags, filters, optionsArg) {
  const options = optionsArg || {};

  return new Promise((resolve, reject) => {
    const parsedType = parseType(typeArg);
    const parsedFlags = parseFlags(flags);
    const parsedFilters = parseFilters(filters);
    const parsedOptions = parseOptions(options);
    if (parsedType instanceof Error) return reject(parsedType);
    if (parsedFlags instanceof Error) return reject(parsedFlags);
    if (parsedFilters instanceof Error) return reject(parsedFilters);
    if (parsedOptions instanceof Error) return reject(parsedOptions);

    const message = `get ${parsedType} ${parsedFlags} ${parsedFilters} ${parsedOptions}`;
    this.execute(message).then(resolve, reject);
  });
}

module.exports = get;
