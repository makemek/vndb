An API wrapper for [VNDB API](https://vndb.org/d11) with zero dependencies. It currently only supports GET operations.

# Requirements

* Node.js@^6.0.0

# Quick Start

Install this package from github.

``` sh
npm install Permagate/vndb
```

Test by fetching vn list.

``` js
const vndb = require('vndb');
const client = vndb.createClient();

client.login()
  .then(() => client.vn())
  .then((result) => console.log(result.data))
  .catch((e) => console.log(e));
```

# Client

First of all, please keep in mind that all client methods return a promise.

### Connection methods

``` js
// Login
client.login();

// End the connection
client.end();
```

### Fetch methods

``` js
// Fetch VN list
client.vn();

// Fetch release list
client.release();

// Fetch producer list
client.producer();

// Fetch character list
client.character();
```

### Fetch option

All fetch methods accept an option parameter. For the most part, valid values of each option are following the definition in the [VNDB API Reference](https://vndb.org/d11).

``` js
// Set 'filters' to filter the results.
client.vn({ filters: 'id = 8' });

// Set 'flags' to get partial response.
// Defaults to all possible flags for each resource.
client.vn({ flags: ['basic'] });

// Set 'results' to set the number of results per call.
// Defaults to VNDB default value (10).
client.vn({ results: 10 });

// Set 'page' to get page x of the results.
// Defaults to 1.
client.vn({ page: 5 });

// Set 'sort' to sort the results by a certain field.
// Defaults to VNDB default value (id).
client.vn({ sort: 'rating' });

// Set 'reverse' to reverse the sort.
// Defaults to false.
client.vn({ reverse: true });
```

# Test

Simply run `npm test`. This is an integration test of sorts, so it makes real requests to VNDB API.

