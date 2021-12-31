const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require("discord.js");
const { getApi } = require("../utils/getApi.util");
const { getCurrency } = require("../utils/getCurrency.util");
const { getNodeButtons } = require("../utils/getNodeButtons.util");
const { getUser } = require("../utils/getUser.util");

module.exports = {
  data: new SlashCommandBuilder()
        .setName('node')
        .setDescription('Get node info')
        .addStringOption(option =>
          option.setName('name')
                .setDescription('Node name')
                .setRequired(true)
        ),
  async execute(interaction) {
    const query = interaction.options.get('name')
    const nodeApi = await getApi(`${process.env.API_URL}/nodes/${query.value}`);

    // checking if the result return more than 1
    if (nodeApi.length > 1) {
      // setting options for multiple results
      let options = []
      if (nodeApi.length > 25) {
        let i = 0;
        for (i; i < 25; i ++) {
          options.push({
            'label': nodeApi[i].name,
            'description': (nodeApi[i].zone !== 'N/A')? `Location: ${nodeApi[i].zone}` : `Main Node: ${nodeApi[i].main}`,
            'value': `${nodeApi[i].name},${i}`,
          })
        }
      } else {
        nodeApi.map((node, index) => {
          options.push({
            'label': node.name,
            'description': (node.zone !== 'N/A')? `Location: ${node.zone}` : `Main Node: ${node.main}`,
            'value': `${node.name},${index}`,
          })
        });
      }

      const optionsData = new MessageActionRow()
        .addComponents(
          new MessageSelectMenu()
            .setCustomId('node')
            .setPlaceholder('Pick a Node')
            .addOptions(options)
        );
      
      await interaction.reply({content: `Multiple results found.`, components: [optionsData] });
    } else {
      // getting user data for investment status
      const userApi = await getUser(interaction.user.id);
      const invested = userApi.investment.filter(node => node === parseInt(nodeApi[0].id));

      // formatting node products
      // TODO: move this to util so it can be reused
      const products = (nodeApi[0].products.length > 0)? 
          nodeApi[0].products.map(product => {
            return `- ${product}\n`
          })
          : 'N/A';
        
      // formatting connected nodes
      // TODO: move this to util so it can be reused
      const connectedNodes = nodeApi[0].sub.map(node => {
        return `- ${node}\n`
      })
        
      const embed = new MessageEmbed()
        .setColor('BLUE')
        .setTitle(nodeApi[0].name)
        .setDescription((nodeApi[0].zone !== 'N/A')? nodeApi[0].zone : nodeApi[0].main)
        .addFields(
          { name: 'Node Manager', value: nodeApi[0].manager },
          { name: 'Status', value: (invested.length !== 0)? 'Invested' : 'Not Invested'},
          { name: 'Contribution Point', value: `${nodeApi[0].cp}`},
          { name: 'Water', value: `${nodeApi[0].weather.water}`, inline: true },
          { name: 'Humidity', value: `${nodeApi[0].weather.humidity}`, inline: true },
          { name: 'Temperature', value: `${nodeApi[0].weather.temperature}`, inline: true },
          { name: 'Products', value: `${(Array.isArray(products))? products.join('') : products}`, inline: true},
          { name: 'Gold Investment', value: `- Type: ${nodeApi[0].investment.type}\n- Interest: ${getCurrency(nodeApi[0].investment.interest)}`, inline: true},
          (nodeApi[0].sub.length > 0)? 
            { name: 'Sub Nodes', value: (Array.isArray(connectedNodes))? connectedNodes.join('') : connectedNodes } 
          :
            { name: 'Workload', value: `${nodeApi[0].workload}`}  
        )
        .setFooter({ text: 'Tip: use "/info" to see your data'})
        .setTimestamp()
        
      await interaction.reply({ 
        content: `Information regarding **${(nodeApi[0].zone !== 'N/A')? nodeApi[0].zone : nodeApi[0].main} - ${nodeApi[0].name}**`, 
        components: [await getNodeButtons(interaction.user, nodeApi[0].id, nodeApi[0].cp)], 
        embeds: [embed]})
    }   
  },
};