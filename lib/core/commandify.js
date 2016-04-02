'use strict';

const terminator = '\u0004';

const commandify = (command, body) => {
  let result = `${command}${terminator}`;
  if (body) {
    const bodyString = JSON.stringify(body);
    result = `${command} ${bodyString}${terminator}`;
  }
  return result;
};

module.exports = commandify;
