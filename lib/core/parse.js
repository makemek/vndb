'use strict';

function parse(rawResponse) {
  const response = rawResponse.toString('utf8');
  const separator = response.indexOf(' ');
  const type = response.slice(0, separator);
  const data = response.slice(separator + 1, response.length - 1);

  return {
    type,
    data: data === type ? data : JSON.parse(data),
  };
}

module.exports = parse;
