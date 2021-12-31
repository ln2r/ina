// hit db -> save cache -> use cache
const fetch = require('node-fetch');
const { redisClient } = require('../configs/redis.config');

exports.getApi = async (url) => {
  // converting to lower case
  url = url.toLowerCase();

  // check cache
  console.debug(`Fetch: Checking cache on "${url}"`);
  const response = await redisClient.get(url);

  if (response) {
    console.debug(`Fetch: Cache hit, returning`);
    return JSON.parse(response);
  }

  console.debug(`Fetch: Cache miss`);
  // cache miss
  const api = await fetch(url);
  const body = await api.json();
  
  if (body.status === 500) {
    console.error(body.body)
    return body.body;
  } else {
    await redisClient.set(
      url,
      JSON.stringify(body.body),
      'EX',
      60,
    );

    return body.body;
  } 
}
