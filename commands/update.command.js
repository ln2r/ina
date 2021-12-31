const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { getApi } = require("../utils/getApi.util");
const { getUser } = require("../utils/getUser.util");
const { setUser } = require("../utils/setUser.util");

module.exports = {
  data: new SlashCommandBuilder()
        .setName('update')
        .setDescription('Update your info here')
        .addStringOption(option =>
          option.setName('cp')
                .setDescription('Your current Contribution Point')
                .setRequired(true)
        ),
  async execute(interaction) {
    const userApi = await getUser(interaction.user.id);

    let maxCp = interaction.options.get('cp').value;
    let usedCp = (userApi === 'Not Found' && !userApi)? '0' : userApi.cp.used;
    let invested =  userApi.investment.map(async (node) => {
      const nodeApi = await getApi(`${process.env.API_URL}/nodes/id/${node}`);

      return `${(nodeApi.main === 'N/A')? nodeApi.zone : nodeApi.main} - ${nodeApi.name}`
    });

    // wait promise if data found
    invested = await Promise.all(invested)

    // update data
    const payload = {
      cp: {
        amount: maxCp
      }
    }
    const res = await setUser(interaction.user.id, payload)
    
    console.debug(`used cp: ${usedCp}, maxcp: ${maxCp}, invested: ${invested}`)

    if (res.status === 200) {
      const userEmbed = new MessageEmbed()
      .setColor('YELLOW')
      .setTitle(`${interaction.user.username} Data`)
      .setDescription(`CP: ${usedCp}/${maxCp}`)
      .addFields(
        { name: 'Invested Node', value: (Array.isArray(invested) && invested.length > 0)? invested.join('\n') : 'No Data' },  
      )
      .setFooter({ text: 'Tip: Use "/info" to see your data' })
      .setTimestamp();

      await interaction.reply({ 
        content: `Updated **${interaction.user.username}** data`, 
        components: [], 
        embeds: [userEmbed],
      });
    } else {
      await interaction.reply({
        content: `There's issue updating your data, please try again later`, 
        components: [], 
        embeds: [],
      })
    }   
  },
};