'use strict';
const vndb = require('./index');

// Procedural Style
const client1 = vndb.createClient();
client1.login().then(null, err => console.log(err));
client1.dbstats().then(data => console.log(data), err => console.log(err));
client1.finish();

// Promise Style 1
const client2 = vndb.createClient();
client2.login()
  .then(null, err => console.log(err))
  .then(() => client2.dbstats())
  .then(data => console.log(data), err => console.log(err))
  .then(() => client2.finish());

// Promise Style 2
const client3 = vndb.createClient();
client3.login()
  .then(null, err => console.log(err))
  .then(client3.dbstats.bind(client3))
  .then(data => console.log(data), err => console.log(err))
  .then(client3.finish.bind(client3));
