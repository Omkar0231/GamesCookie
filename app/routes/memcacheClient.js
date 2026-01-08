const Memcached = require('memcached');

const memcached = new Memcached('gamescookie-lyrlov.serverless.aps1.cache.amazonaws.com:11211', {
  retries: 10,
  retry: 10000,
  remove: true,
  timeout: 5000
});

module.exports = memcached;