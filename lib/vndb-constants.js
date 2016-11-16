module.exports = {
  defaults: {
    // Server information
    host: 'api.vndb.org',
    port: 19535,

    // Login information
    protocol: 1,
    client: 'demo',
    clientver: 0.1,
    username: null,
    password: null,

    // Get parameters
    vn: {
      flags: ['basic', 'details', 'anime', 'relations', 'tags', 'stats', 'screens'],
      filters: '(id > 1)',
    },
  },

  // All requests and responses must end with this terminator
  terminator: '\u0004',

  allowedOptions: [
    'page',
    'results',
    'sort',
    'reverse',
  ],
};

