"use strict";

require('dotenv').config();

var TelegramBot = require('node-telegram-bot-api');

var _require = require('./btoScraper'),
    scrape = _require.scrape;

var token = process.env.TELEGRAM_TOKEN;
var bot = new TelegramBot(token, {
  polling: true
});
bot.onText(/\/start/, function _callee(msg) {
  var message;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          bot.sendMessage(msg.chat.id, "Please wait a couple of minutes while we scrape the data for you!");
          _context.next = 3;
          return regeneratorRuntime.awrap(scrape());

        case 3:
          message = _context.sent;
          bot.sendMessage(msg.chat.id, message);

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
});
module.exports = bot;