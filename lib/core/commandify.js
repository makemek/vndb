'use strict';

const terminator = '\u0004';

function _stringifyModifier(modifier) {
  return Array.isArray(modifier) ? ` ${modifier.join(',')}` : ` ${modifier}`;
}

function commandify(command, modifiers, body) {
  let result = `${command}`;

  if (Array.isArray(modifiers)) {
    result += modifiers.map(_stringifyModifier).join('');
  } else if (typeof modifiers === 'string' || modifiers instanceof String) {
    result += ` ${modifiers}`;
  }

  if (body) {
    const bodyString = JSON.stringify(body);
    result += bodyString;
  }

  result += `${terminator}`;
  return result;
}

module.exports = commandify;
