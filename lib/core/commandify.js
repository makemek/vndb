'use strict';

const terminator = '\u0004';

function commandify(command, body) {
  let result = `${command}${terminator}`;
  if (body) {
    const bodyString = JSON.stringify(body);
    result = `${command} ${bodyString}${terminator}`;
  }
  return result;
}

module.exports = commandify;
