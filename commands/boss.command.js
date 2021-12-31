const ago = require('s-ago');

const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { getApi } = require("../utils/getApi.util");
const { getRandom } = require('../utils/getRandom.util');

module.exports = {
  data: new SlashCommandBuilder()
        .setName('boss')
        .setDescription('See the next boss spawn')
        .addStringOption(option => 
          option.setName('name')
            .setDescription('Boss name')
            .setRequired(false)
        ),
  async execute(interaction) {
    const now = new Date();
    const day = now.getUTCDay();
    const currentTime = new Date(0, 0, 0, now.getUTCHours(), now.getUTCMinutes());
    const days = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];

    // message stuff
    let messageContent;
    let embedContent = [];
    
    // getting next closest boss
    if (!interaction.options.get('name')) {
      const timeData = await getApi(`${process.env.API_URL}/boss/day/${days[day]}`);
      
      // getting the right boss
      let smallest = 86400000;
      let smallestName;
      let smallestTime;

      // TODO: move to utils or make it a function
      timeData.map(boss => {
        boss.time.map(time => {
          const hour = time.split('.')
          const t = new Date(0, 0, 0, hour[0], 0);
          
          const remaining = (t - currentTime);
          console.debug(`remaining: ${remaining}`);

          if (remaining > 0 && remaining < smallest) {
            smallest = remaining;
            smallestName = boss.name;
            smallestTime = new Date(now.getTime() + smallest);
          };
        });
      });

      // getting the boss data
      const bossData = await getApi(`${process.env.API_URL}/boss/${smallestName}`);

      if (bossData !== 'Not Found') {
        messageContent = `Next closest boss is **${smallestName}**`;
        embedContent = new MessageEmbed()
          .setColor('RED')
          .setTitle(`World Boss - ${bossData[0].name}`)
          .setDescription(`Guide: [Wiki](${bossData[0].guide})\nLocation: ${bossData[0].location}\nWhen: **${ago(smallestTime.getMilliseconds())}**`
          )
          .setFooter({ text: `Tip: ${bossData[0].tips[getRandom(0, bossData[0].tips.length)]}` })
          .setImage(bossData[0].image)
          .setTimestamp()
      } else {
        messageContent = `Can't find anything under that`;
      }     
    } else {
      // getting queried boss
      const query = interaction.options.get('name').value;
      const bossApi = await getApi(`${process.env.API_URL}/boss/${query}`);

      // returned array of time if there're some for the day
      // returned empty array if not
      const todayTime = bossApi[0].time[[days[day]]];
      
      // set the default smallest to 24 hours
      let smallest = 86400000;
      let smallestTime;
      todayTime.map((time) => {
        const hour = time.split('.')
        const t = new Date(0, 0, 0, hour[0], 0);
        
        const remaining = (t - currentTime);
        console.debug(`current: ${currentTime}, remaining: ${remaining}`);

        if (remaining < smallest) {
          smallest = remaining
          smallestTime = new Date(now.getTime() - ((parseInt(hour[0]) + 7) * 60 * 60 * 1000))
        }
      });

      const closestTime = (todayTime.length == 0)? 'No spawn for today' : ((smallest < 0)? `No spawn left for today (${ago(smallestTime)})` : ago(smallestTime));

      messageContent = `Information on **${bossApi[0].name}**`;
      embedContent = new MessageEmbed()
        .setColor('RED')
        .setTitle(`World Boss - ${bossApi[0].name}`)
        .setDescription(`Guide: [Wiki](${bossApi[0].guide})\nLocation: ${bossApi[0].location}\nClosest: **${closestTime}**`
        )
        .setFooter({ text: `Tip: ${bossApi[0].tips[getRandom(0, bossApi[0].tips.length)]}`})
        .setImage(bossApi[0].image)
        .setTimestamp();
    }

    // sending reply
    await interaction.reply({ 
      content: messageContent, 
      components: [], 
      embeds: [embedContent],
    })
  },
};