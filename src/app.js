const path = require('path')
const mongoose = require('mongoose')
const Quote = require('./models/quote')
const { Client, VoiceChannel, Intents } = require('discord.js');
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  entersState,
  StreamType,
  AudioPlayerStatus,
  VoiceConnectionStatus,
} = require('@discordjs/voice');

const cfg = require('../config.json');

/**
 * Set up Mongoose connection
 */
mongoose.connect('mongodb://' + cfg.host + ':' + cfg.port.toString() + '/dotabot', {
  useNewUrlParser: true,
  // useCreateIndex: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const addQuote = async (quote, url) => {
  let stripped = quote.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
  const newQuote = new Quote({
    quote: quote,
    url: url,
    stripped: stripped
  })
  await newQuote.save();
  
}


/**
 * Connect discord client
 */
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});
void client.login(cfg.token);
client.on('ready', async () => {
  console.log('Discord.js client is ready!');
});