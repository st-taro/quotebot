// External modules
const path = require('path');
const mongoose = require('mongoose');
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

// Local helpers
const { parse } = require('./utils/commands');

// Mongoose models
const Quote = require('./models/quote');

// Configuration
const cfg = require('../config.json');

// Local vars
const queue = new Map();

/**
 * Set up Mongoose connection
 */
mongoose.connect(
  'mongodb://' + cfg.host + ':' + cfg.port.toString() + '/dotabot',
  {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
  }
);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

/**
 * Helper function to create a new quote and store it in the database.
 * @param {*} quote
 * @param {*} url
 */
const addQuote = async (quote, url) => {
  let stripped = quote
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
  const newQuote = new Quote({
    quote: quote,
    url: url,
    stripped: stripped,
  });
  await newQuote.save();
  console.log(newQuote);
};

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

/**
 * Command functions
 */
async function playQuote(message, serverQueue) {
  const quote = message.content.substring(message.content.indexOf(' ') + 1);
  console.log('Play quote: ' + quote);
  const cleanedQuote = quote.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');

  // grab user's voice channel
  const voiceChannel = message.member.voice.channel;
  if(!voiceChannel) {
    return message.channel.send('You need to be in a voice channel!')
  }
  // check for voice permissions!
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if(!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
    return message.channel.send('Missing voice channel permissions!')
  }

}

/**
 * DISCORD EVENT LISTENERS
 */

client.once('ready', () => {
  console.log('Client ready!');
});
client.once('reconnecting', () => {
  console.log('Client reconnecting.');
});
client.once('disconnect', () => {
  console.log('Client disconnected');
});

client.on('message', async (message) => {
  // Ignore if the message is from our bot
  if (message.author.bot) return;
  // Ignore if not starting with prefix
  if (!message.content.startsWith(cfg.commandprefix)) return;

  const playQueue = queue.get(messge.guild.id);

  // Handle commands
  if (message.content.startsWith(`${cfg.commandprefix}q`)) {
    /**
     * q command
     * following string should be a quote we want to match.
     */
    playQuote(message, playQueue);
    return;
  }
  if (message.content.startsWith(`${cfg.commandprefix}skip`)) {
    skip(message, playQueue);
    return;
  } else {
    message.channel.send('Not a valid command.');
  }
});
