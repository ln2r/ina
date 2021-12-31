const { MessageEmbed } = require('discord.js');
const ontime = require('ontime');
const { getApi } = require('../utils/getApi.util');
const { getRandom } = require('../utils/getRandom.util');

exports.bossNotification = (discordClient) => {
  console.log(`Cron: Automation started for boss notification`);

  // https://www.npmjs.com/package/ontime
  ontime({
    cycle: ['12:30:00', '03:45:00', '04:45:00', '05:45:00', '07:30:00', '10:30:00', '14:30:00', '17:30:00', '22:30:00'],
    utc: true,
  }, async (bossTime) => {
      const now = new Date();
      const day = now.getUTCDay();
      const hour = now.getUTCHours();
  
      await sendNotification(day, hour, discordClient);
  
      bossTime.done();
  });  
}

const sendNotification = async (day, currentTime, discordClient) => {
  let selected = [];
  const days = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
  const timeData = await getApi(`${process.env.API_URL}/boss/day/${days[day]}`);
  
  // getting the right boss
  timeData.map(boss => {
    boss.time.map(time => {
      const t = time.split('.');

      // adding 1 to get the current boss since the timer
      // triggered 30 mins before the actual spawn time
      if(parseInt(t[0]) === (currentTime + 1)) {
        selected.push(boss);
      }
    });
  });

  // getting bosses data
  let embedContent = selected.map(async boss => {
    const bossData = await getApi(`${process.env.API_URL}/boss/${(boss.name)}`);

    return new MessageEmbed()
      .setColor('RED')
      .setTitle(`World Boss - ${bossData[0].name}`)
      .setDescription(`Guide: [Wiki](${bossData[0].guide})\nLocation: ${bossData[0].location}`)
      .setFooter({ text: `Tip: ${bossData[0].tips[getRandom(0, bossData[0].tips.length)]}`})
      .setImage(bossData[0].image)
      .setTimestamp()
  });

  embedContent = await Promise.all(embedContent);

  // sending notification
  discordClient.guilds.cache.map(async function(guild) {  
    if (guild.available) {
      let found = 0;
      guild.channels.cache.map((ch) => {
        if (found === 0) {
          if (ch.id === process.env.DISCORD_CHANNEL_ID) {
            found = 1;
            if (ch.permissionsFor(discordClient.user).has('EMBED_LINKS', 'SEND_MESSAGES', 'VIEW_CHANNEL')) {
              ch.send({
                content: `Incoming Boss Spawn!`, 
                components: [], 
                embeds: embedContent,
              });
            }
          }
        }
      });
    }
  });
}