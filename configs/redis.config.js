const Redis = require('ioredis')

exports.redisClient = new Redis(process.env.REDIS_URL)