require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const fsPromises = require('fs').promises;

const { scrape } = require('./btoScraper');
const db = require('./db.json');

const token = process.env.TELEGRAM_TOKEN;

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, async (msg) => {
  bot.sendMessage(msg.chat.id, "Please wait a couple of minutes while we scrape the data for you!");
  const highUnitsLeft = await scrape();

  const lastQueueNumber = db.lastQueueNumber;
  const potentialQueueBetween = Math.trunc((874 - lastQueueNumber) * 0.82);
  const potentialHighFloorsToSelect = highUnitsLeft - potentialQueueBetween;

  bot.sendMessage(msg.chat.id, 'Number of high units (6 and above) remaining: ' + highUnitsLeft);
  bot.sendMessage(msg.chat.id, 'Potential number of high floors left to select from: ' + potentialHighFloorsToSelect);
});

bot.onText(/\/q/, async (msg) => {
  const lastQueueNumber = parseInt(msg.text.split(' ')[1]);

  if (lastQueueNumber === NaN) {
    bot.sendMessage(msg.chat.id, "Sorry, please give the last queue number as such - '/q 758'")
  } else {
    db.lastQueueNumber = lastQueueNumber;
    await fsPromises.writeFile('./db.json', JSON.stringify(db));

    bot.sendMessage(msg.chat.id, `The last queue number, ${lastQueueNumber} is updated!`);
  }
})

module.exports = bot;