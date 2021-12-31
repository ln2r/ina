
const { MessageEmbed } = require("discord.js");
const { getApi } = require("../utils/getApi.util");
const { getCurrency } = require("../utils/getCurrency.util");
const { getNodeButtons } = require("../utils/getNodeButtons.util");
const { getUser } = require("../utils/getUser.util");

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
      if (!interaction.isSelectMenu()) return;

      if (interaction.customId === 'node') {
        const query = interaction.values[0].split(',');
        const nodeApi = await getApi(`${process.env.API_URL}/nodes/${query[0]}`);
        const nodeData = (nodeApi.length > 1)? nodeApi[query[1]] : nodeApi[0]

        // getting user data for investment status
        const userApi = await getUser(interaction.user.id);
        const invested = userApi.investment.filter(node => node === parseInt(nodeData.id));

        // formatting node products
        // TODO: move to utils
        const products = (nodeData.products.length > 0)? 
          nodeData.products.map(product => {
            return `- ${product}\n`
          })
          : 'N/A';

        // formatting connected nodes
        // TODO: move to utils
        const connectedNodes = nodeData.sub.map(node => {
          return `- ${node}\n`
        })
        
        const embed = new MessageEmbed()
          .setColor('BLUE')
          .setTitle(nodeData.name)
          .setDescription((nodeData.zone !== 'N/A')? nodeData.zone : nodeData.main)
          .addFields(
            { name: 'Node Manager', value: nodeData.manager },
            { name: 'Status', value: (invested.length !== 0)? 'Invested' : 'Not Invested'},
            { name: 'Contribution Point', value: `${nodeData.cp}`},
            { name: 'Water', value: `${nodeData.weather.water}`, inline: true },
            { name: 'Humidity', value: `${nodeData.weather.humidity}`, inline: true },
            { name: 'Temperature', value: `${nodeData.weather.temperature}`, inline: true },
            { name: 'Products', value: `${(Array.isArray(products))? products.join('') : products}`, inline: true},
            { name: 'Gold Investment', value: `- Type: ${nodeData.investment.type}\n- Interest: ${getCurrency(nodeData.investment.interest)}`, inline: true},
            (nodeData.sub.length !== 0)? 
            { name: 'Sub Nodes', value: connectedNodes.join('') } 
          :
            { name: 'Workload', value: `${(nodeData.workload)? nodeData.workload : '0'}`}
          )
          .setFooter({ text: 'Tip: Use the buttons below to mark as contributed' })
          .setTimestamp()

        await interaction.deferUpdate();
        await interaction.editReply({ 
          content: `Information regarding **${(nodeData.zone !== 'N/A')? nodeData.zone : nodeData.main} - ${nodeData.name}**`,
          components: [await getNodeButtons(interaction.user, nodeData.id, nodeData.cp)],
          embeds: [embed]
        })
      }
  }
}