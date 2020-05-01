require('dotenv').config();

const Discord = require('discord.js');
const ontime = require('ontime');

const client = new Discord.Client();
const services = require('./src/services/index.js');

//const config = require('./config.json');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.BLOB_DISCORD_TOKEN);

ontime({
  cycle: ['06:30:00', '09:30:00', '13:30:00', '16:30:00', '20:30:00', '23:30:00', '03:45:00', '04:45:00', '05:45:00'],
  utc: true,
}, function(bossTime){
  const t = new Date();

  services.sendBossNotification(t.getUTCHours(), client);

  bossTime.done();
})