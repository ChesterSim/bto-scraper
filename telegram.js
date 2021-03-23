require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { scrape } = require('./btoScraper');

const token = process.env.TELEGRAM_TOKEN;

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, async (msg) => {
  bot.sendMessage(msg.chat.id, "Please wait a couple of minutes while we scrape the data for you!");
  const highUnitsLeftPromise = scrape();

  bot.sendMessage(msg.chat.id, "In the meantime, let me know how what is the last queue number.")

  bot.on('message', async (msg) => {
    const lastQueueNumber = msg.text;
    const potentialQueueBetween = Math.trunc((874 - lastQueueNumber) * 0.82);
    const highUnitsLeft = await highUnitsLeftPromise;
    const potentialHighFloorsToSelect = highUnitsLeft - potentialQueueBetween;

    bot.sendMessage(msg.chat.id, 'Number of high units (6 and above) remaining: ' + highUnitsLeft);
    bot.sendMessage(msg.chat.id, 'Potential number of high floors left to select from: ' + potentialHighFloorsToSelect);
  })
});

module.exports = bot;