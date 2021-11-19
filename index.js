require('dotenv').config();
const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const asyncWrapper = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch(next);
  };
};

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (msg) => {
  if (msg.content === 'test') {
    msg.reply('test');
  }
});

client.login(process.env.CLIENT_TOKEN);
