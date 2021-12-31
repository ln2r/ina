const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { getApi } = require('../utils/getApi.util');
const { getUser } = require("../utils/getUser.util");

module.exports = {
  data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('See your saved data'),
  async execute(interaction) {
    const userApi = await getUser(interaction.user.id);

    let invested;
    if (userApi !== 'Not Found') {
      invested = userApi.investment.map(async (node) => {
        const nodeApi = await getApi(`${process.env.API_URL}/nodes/id/${node}`);
        return `${(nodeApi.main === 'N/A')? nodeApi.zone : nodeApi.main} - ${nodeApi.name}`
      })
 
      invested = await Promise.all(invested);
    }

    const userEmbed = new MessageEmbed()
      .setColor('YELLOW')
      .setTitle(`${interaction.user.username} Data`)
      .setDescription(`CP: ${(userApi !== 'Not Found')? `${userApi.cp.used}/${userApi.cp.amount}` : 'No Data'}`)
      .addFields(
        { name: 'Invested Node', value: (Array.isArray(invested) && invested.length > 0)? invested.join('\n') : 'No Data' },  
      )
      .setFooter({ text: 'Tip: Use "/update" to update your data' })
      .setTimestamp();

    await interaction.reply({ 
      content: `Information on **${interaction.user.username}**`, 
      components: [], 
      embeds: [userEmbed]
    });    
  },
};