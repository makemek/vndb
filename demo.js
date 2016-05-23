'use strict';
const util = require('util');
const vndb = require('./index');

const _print = (identifier, obj) => {
  console.log(`---${identifier}---`);
  console.log(util.inspect(obj, false, null));
};

// Start connection
const client = vndb.createClient();

// Login
client.login()
  .then(data => _print('login', data))
  .catch(err => _print('login', err));

// Get dbstats
client.dbstats()
  .then(data => _print('dbstats', data))
  .catch(err => _print('dbstats', err));

// Get any
client.get({
  type: 'vn',
  flags: ['basic', 'details'],
  filters: 'id >= 1',
  results: 1,
}).then(data => _print('get', data))
  .catch(err => _print('get', err));

// Get vn
client.vn({ results: 1 })
  .then(data => _print('vn', data))
  .catch(err => _print('vn', err));

// Get release
client.release({ results: 1 })
  .then(data => _print('release', data))
  .catch(err => _print('release', err));

// Get producer
client.producer({ results: 1 })
  .then(data => _print('producer', data))
  .catch(err => _print('producer', err));

// Get character
client.character({ results: 1 })
  .then(data => _print('character', data))
  .catch(err => _print('character', err));

// End connection
client.finish()
  .then(() => console.log('Demo finished!'))
  .catch(err => console.error(err));
