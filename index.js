require('dotenv').config();

const { Collection } = require('discord.js');
const fs = require('fs');
const { discordClient } = require('./configs/discord.config');
const { bossNotification } = require('./crons/boss.cron');

// commands
discordClient.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.command.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  discordClient.commands.set(command.data.name, command);
};

// events
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.event.js'));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);

  if (event.once) {
    discordClient.once(event.name, (...args) => event.execute(...args));
  } else {
    discordClient.on(event.name, (...args) => event.execute(...args));
  }
};

// crons
bossNotification(discordClient);

// discord login
discordClient.login(process.env.DISCORD_TOKEN);