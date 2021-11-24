import { Client, VoiceChannel, Intents } from 'discord.js';
import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  entersState,
  StreamType,
  AudioPlayerStatus,
  VoiceConnectionStatus,
} from '@discordjs/voice';
import { createDiscordJSAdapter } from './adapter';

const mongoose = require('mongoose');
const path = require('path');
const cfg = require('../config.json');
const Quote = require('./models/quote')
const { quoteSchema } = require('./schemas')

const voiceHelpers = require('./utils/discordVoiceHelpers');

/**
 * Mongoose connection
 */
mongoose.connect('mongodb://' + cfg.host + ':' + cfg.port + '/dotabot', {
  useNewUrlParser: true,
  // useCreateIndex: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const addQuote = async (quote: string, url: string) => {
  let stripped = quote.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
  const newQuote = new Quote({
    quote: quote,
    url: url,
    stripped: stripped
  })
  await newQuote.save();
}



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

  /**
   * Try to get our song ready to play for when the bot joins a voice channel
   */
  try {
    await voiceHelpers.playSong();
    console.log('Song is ready to play!');
  } catch (error) {
    /**
     * The song isn't ready to play for some reason :(
     */
    console.error(error);
  }
});

client.on('messageCreate', async (message) => {
  if (!message.guild) return;


  // Add a message
  if (message.content.substring(0, 4) === '-add ') {

  }


  // Play a message
  if (message.content === '-join') {
    const channel = message.member?.voice.channel;

    if (channel) {
      /**
       * The user is in a voice channel, try to connect.
       */
      try {
        const connection = await voiceHelpers.connectToChannel(channel);

        /**
         * We have successfully connected! Now we can subscribe our connection to
         * the player. This means that the player will play audio in the user's
         * voice channel.
         */
        connection.subscribe(voiceHelpers.player);
        await message.reply('Playing now!');
      } catch (error) {
        /**
         * Unable to connect to the voice channel within 30 seconds :(
         */
        console.error(error);
      }
    } else {
      /**
       * The user is not in a voice channel.
       */
      void message.reply('Join a voice channel then try again!');
    }
  }
});
