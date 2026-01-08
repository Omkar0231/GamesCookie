const Memcached = require('memcached');

// Use environment variable for memcached host or default to localhost
const memcachedHost = process.env.MEMCACHED_HOST || 'localhost:11211';

const memcached = new Memcached(memcachedHost, {
  retries: 10,
  retry: 10000,
  remove: true,
  timeout: 5000
});

module.exports = memcached;