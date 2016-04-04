'use strict';
const util = require('util');
const vndb = require('./index');

const _print = (identifier, obj) => {
  console.log(`---${identifier}---`);
  console.log(util.inspect(obj, false, null));
};

const client1 = vndb.createClient();
client1.login().then(data => _print('login', data), err => _print('login', err));
client1.dbstats().then(data => _print('dbstats', data), err => _print('dbstats', err));
client1.execute('get vn basic,details (id >= 1)').then(data => _print('raw-vn', data), err => _print('raw-vn', err));
client1.get('vn', ['basic', 'details'], 'id >= 1', { results: 3 }).then(data => _print('vn', data), err => _print('vn', err));
client1.get('release', ['basic', 'details'], 'id >= 1', { results: 3 }).then(data => _print('release', data), err => _print('release', err));
client1.get('producer', ['basic', 'details'], 'id >= 1', { results: 3 }).then(data => _print('producer', data), err => _print('producer', err));
client1.get('character', ['basic', 'details'], 'id >= 1', { results: 3 }).then(data => _print('character', data), err => _print('character', err));

client1.finish();
