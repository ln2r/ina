const fetch = require('node-fetch');
const { getApi } = require('../utils/getApi.util');
const { getUser } = require('../utils/getUser.util');
const { setUser } = require('../utils/setUser.util');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isButton()) return;

    const userApi = await getUser(interaction.user.id)
    
    // button id - node id - cp
    const customId = interaction.customId.split('-');
    const nodeId = customId[1];
    const cp = customId[2];

    // console.debug(`customId: ${customId[0]}, nodeId: ${nodeId}, cp: ${cp}`);

    let usedCp;
    let investedNode = userApi.investment;
    if (customId[0] === 'nodeAdd') {
      // adding stuff
      usedCp = parseInt(userApi.cp.used) + parseInt(cp);
      investedNode.push(parseInt(nodeId));

      // checking max cp
      if (usedCp > userApi.cp.amount) {
        await interaction.deferUpdate()
        await interaction.editReply({
          content: `Unable to add more node, exceeding your maximum cp count (${userApi.cp.used}/${userApi.cp.amount})`,
          components: [],
          embeds: []
        });

        return;
      }
    } else if (customId[0] === 'nodeWithdraw') {
      // removing stuff
      usedCp = parseInt(userApi.cp.used) - parseInt(cp);
      investedNode = investedNode.filter(node => node !== parseInt(nodeId));
    }

    const payload = {
      cp: {
        used: usedCp
      },
      investment: investedNode
    }

    // updating data
    const res = await setUser(interaction.user.id, payload);
  
    await interaction.deferUpdate();
    if (res.status === 200) {
      await interaction.editReply({ 
        content: `Updated your contributed node list.`,
        components: [],
        embeds: []
      });
    } else {
      await interaction.editReply({ 
        content: `There's issue updating your node contribution list, please try again later.`,
        components: [],
        embeds: []
      });
    }
  }
}