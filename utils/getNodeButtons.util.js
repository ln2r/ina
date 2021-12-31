const { MessageActionRow, MessageButton } = require("discord.js");
const { getUser } = require("./getUser.util");

// TODO: appened user api data with user object
exports.getNodeButtons = async (userObject, nodeId, cp) => {
  const userApi = await getUser(userObject.id);
  const invested = userApi.investment.filter(node => node === parseInt(nodeId));

  const disabledStatus = (cp, id, invested) => {
    if (cp === 0) {
      return true
    } else {
      if (invested[0]) {
        return (id === 'add')? true : false
      } else if (!invested[0]) {
        return (id === 'add')? false : true
      }
    }
  }

  return new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setCustomId(`nodeAdd-${nodeId}-${cp}`)
        .setLabel('Invest')
        .setStyle('PRIMARY')
        .setDisabled(disabledStatus(cp, 'add', invested))
    )
    .addComponents(
      new MessageButton()
        .setCustomId(`nodeWithdraw-${nodeId}-${cp}`)
        .setLabel('Withdraw')
        .setStyle('PRIMARY')
        .setDisabled(disabledStatus(cp, 'withdraw', invested))
    );
}