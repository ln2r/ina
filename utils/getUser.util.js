// hit db -> save cache -> use cache
const fetch = require('node-fetch');
const { redisClient } = require('../configs/redis.config');

exports.getUser = async (userId) => {
  console.debug(`Fetch: getting user data for "${userId}"`);
  // cache miss
  const api = await fetch(`${process.env.API_URL}/user/${userId}`);
  const body = await api.json();
  
  if (body.status === 500) {
    console.error(body.body)
    return body.body;
  } else {
    return body.body;
  } 
}
