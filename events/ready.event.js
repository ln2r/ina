const { discordClient } = require("../configs/discord.config");
const { getApi } = require('../utils/getApi.util');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    discordClient.user.setPresence({ activities: [{ name: 'Black Desert Online' }], status: 'online' });
    // checking api connection
    const api = await getApi(`${process.env.API_URL}/`)
    if (api) {console.log(`Api ready!`)}

    console.log(`Ready! Logged in as ${client.user.tag}`);
  },
};