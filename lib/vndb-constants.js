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
      filters: '(id >= 1)',
    },
    release: {
      flags: ['basic', 'details', 'vn', 'producers'],
      filters: '(id >= 1)',
    },
    producer: {
      flags: ['basic', 'details', 'relations'],
      filters: '(id >= 1)',
    },
    character: {
      flags: ['basic', 'details', 'meas', 'traits', 'vns'],
      filters: '(id >= 1)',
    },
    user: {
      flags: ['basic'],
      filters: '(id = 1)',
    },
    votelist: {
      flags: ['basic'],
      filters: '(id = 1)',
    },
    vnlist: {
      flags: ['basic'],
      filters: '(id = 1)',
    },
    wishlist: {
      flags: ['basic'],
      filters: '(id = 1)',
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

