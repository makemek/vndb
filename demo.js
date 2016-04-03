'use strict';
const util = require('util');
const vndb = require('./index');

const _print = obj => {
  console.log(util.inspect(obj, false, null));
};

const client1 = vndb.createClient();
client1.login().then(null, err => _print(err));
client1.dbstats().then(data => _print(data), err => _print(err));
client1.get('vn', ['basic', 'details'], 'id >= 1', { results: 3 }).then(data => _print(data), err => _print(err));
client1.finish();
