const fetch = require('node-fetch');

exports.setUser = async (userId, payload) => {
  console.debug(`Fetch: updating user data for "${userId}"`)
  const res = await fetch(`${process.env.API_URL}/user/${userId}`, {
    method: 'post',
    body: JSON.stringify(payload),
    headers: {'Content-Type': 'application/json'}
  });
  
  return await res.json();
}
