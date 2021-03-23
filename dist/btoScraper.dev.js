"use strict";

require('dotenv').config();

var puppeteer = require('puppeteer');

var blocks = ['222A', '222B', '223A', '223B', '223C', '224A', '224B', '224C', '233A', '233B', '233C'];

module.exports.scrape = function _callee() {
  var pageUrl, puppeteerConfig, browser, page, availableUnits, i, _i, numOfHighUnits, message;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          pageUrl = "https://services2.hdb.gov.sg/webapp/BP13AWFlatAvail/BP13EBSFlatSearch?Town=Toa+Payoh&Flat_Type=BTO&selectedTown=Toa+Payoh&Flat=4-Room&ethnic=Y&ViewOption=A&projName=A&Block=0&DesType=A&EthnicA=Y&EthnicM=&EthnicC=&EthnicO=&numSPR=&dteBallot=202011&Neighbourhood=&Contract=&BonusFlats1=N&searchDetails=Y&brochure=true";
          puppeteerConfig = process.env.NODE_ENV === 'development' ? {} : {
            executablePath: '/usr/bin/chromium-browser',
            headless: true,
            args: ['--no-sandbox']
          };
          _context.next = 4;
          return regeneratorRuntime.awrap(puppeteer.launch(puppeteerConfig));

        case 4:
          browser = _context.sent;
          _context.next = 7;
          return regeneratorRuntime.awrap(browser.newPage());

        case 7:
          page = _context.sent;
          _context.next = 10;
          return regeneratorRuntime.awrap(page["goto"](pageUrl));

        case 10:
          availableUnits = {};
          i = 0;

        case 12:
          if (!(i < 6)) {
            _context.next = 18;
            break;
          }

          _context.next = 15;
          return regeneratorRuntime.awrap(getAvailableUnits(page, availableUnits, i, true));

        case 15:
          i++;
          _context.next = 12;
          break;

        case 18:
          _i = 6;

        case 19:
          if (!(_i < blocks.length)) {
            _context.next = 27;
            break;
          }

          if (!(_i === 9)) {
            _context.next = 22;
            break;
          }

          return _context.abrupt("continue", 24);

        case 22:
          _context.next = 24;
          return regeneratorRuntime.awrap(getAvailableUnits(page, availableUnits, _i, false));

        case 24:
          _i++;
          _context.next = 19;
          break;

        case 27:
          _context.next = 29;
          return regeneratorRuntime.awrap(browser.close());

        case 29:
          numOfHighUnits = calcHighUnits(availableUnits);
          message = 'Number of high units (6 and above) remaining: ' + numOfHighUnits;
          return _context.abrupt("return", message);

        case 32:
        case "end":
          return _context.stop();
      }
    }
  });
};

var calcHighUnits = function calcHighUnits(availableUnits) {
  var total = 0;
  Object.keys(availableUnits).forEach(function (block) {
    availableUnits[block].map(function (unit) {
      var floor = parseInt(unit.slice(1).split('-')[0]);

      if (floor > 5) {
        total++;
      }
    });
  });
  return total;
};

var getAvailableUnits = function getAvailableUnits(page, availableUnits, blockIndex, firstRow) {
  var data;
  return regeneratorRuntime.async(function getAvailableUnits$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;

          if (!firstRow) {
            _context2.next = 6;
            break;
          }

          _context2.next = 4;
          return regeneratorRuntime.awrap(page.click("#blockDetails > div:nth-child(1) > table > tbody > tr:nth-child(1) > td:nth-child(".concat(blockIndex + 1, ") > div")));

        case 4:
          _context2.next = 8;
          break;

        case 6:
          _context2.next = 8;
          return regeneratorRuntime.awrap(page.click("#blockDetails > div:nth-child(1) > table > tbody > tr:nth-child(2) > td:nth-child(".concat(blockIndex - 5, ") > div")));

        case 8:
          _context2.next = 10;
          return regeneratorRuntime.awrap(page.waitForNavigation({
            waitUntil: 'networkidle0'
          }));

        case 10:
          _context2.next = 12;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            var availableUnitElements = Array.from(document.querySelectorAll('table tr td font a font'));
            return availableUnitElements.map(function (td) {
              return td.innerText;
            });
          }));

        case 12:
          data = _context2.sent;
          availableUnits[blocks[blockIndex]] = data.filter(function (e) {
            return e.includes('#');
          });
          _context2.next = 20;
          break;

        case 16:
          _context2.prev = 16;
          _context2.t0 = _context2["catch"](0);
          console.log('Error at block', blocks[blockIndex]);
          console.log(_context2.t0.message);

        case 20:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 16]]);
};