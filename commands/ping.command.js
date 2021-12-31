const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('hi!'),
  async execute(interaction) {
    await interaction.reply('hi from command folder!');
  },
};