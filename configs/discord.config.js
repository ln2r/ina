const { Client, Intents } = require("discord.js");

exports.discordClient = new Client({ intents: [Intents.FLAGS.GUILDS]});