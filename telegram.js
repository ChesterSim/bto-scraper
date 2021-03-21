require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { scrape } = require('./btoScraper');

const token = process.env.TELEGRAM_TOKEN;

const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/start/, async (msg) => {
  bot.sendMessage(msg.chat.id, "Please wait a couple of minutes while we scrape the data for you!");

  const message = await scrape();

  bot.sendMessage(msg.chat.id, message);
});

module.exports = bot;