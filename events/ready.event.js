const { discordClient } = require("../configs/discord.config");

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    discordClient.user.setPresence({ activities: [{ name: 'Black Desert Online' }], status: 'online' });

    console.log(`Ready! Logged in as ${client.user.tag}`);
  },
};