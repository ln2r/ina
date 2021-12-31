const fs = require('fs');
const { resolve } = require('path');

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

require('dotenv').config({path: resolve(__dirname, '../.env')});

const commands = [];
const commandFiles = fs.readdirSync(resolve(__dirname, '../commands')).filter(file => file.endsWith('.command.js'));

for (const file of commandFiles) {
  console.debug(`Deployment: Adding ${file}`)
  const command = require(`../commands/${file}`);
  commands.push(command.data.toJSON());
};

console.log(`Deployment: Starting refresh process...`);
const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);
(async () => {
  try {
    console.log(`Deployment: Refreshing bot (/) commands...`);
    // remove guild
    // rest.get(Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID))
    //   .then(data => {
    //     const promises = [];
    //     for (const command of data) {
    //       const url = `${Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID)}/${command.id}`;
    //       console.log(`Deployment: removing from guild "${url}"`)
    //       promises.push(rest.delete(url));
    //     }

    //     return Promise.all(promises);
    //   })

    // remove global
    // rest.get(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID))
    //   .then(data => {
    //     const promises = [];
    //     for (const command of data) {
    //       const url = `${Routes.applicationCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID)}/${command.id}`;
    //       console.log(`Deployment: removing from global"${url}"`)
    //       promises.push(rest.delete(url));
    //     }

    //     return Promise.all(promises);
    //   })  

    // update
    console.log(`Deployment: adding to guild`);
    await rest.put(
      Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID),
      {
        body: commands,
      }
    );

    console.log(`Deployment: Reloaded and refreshed (/) commands`);
  } catch (error) {
    console.error(error);
  }
})();