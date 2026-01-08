const apicache = require('apicache');
const memcached = require('./memcacheClient');

const cache = apicache.options({

  // 🔥 Use Memcached as store
  store: {
    get: (key, cb) => memcached.get(key, cb),
    set: (key, value, ttl) =>
      memcached.set(key, value, Math.ceil(ttl / 1000), () => {}),
    del: (key) => memcached.del(key, () => {})
  },

  // 🔥 DO NOT cache CORS headers
  headerBlacklist: [
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Credentials',
    'Vary'
  ],

  // Optional but helpful
  debug: false
}).middleware;

module.exports = cache;