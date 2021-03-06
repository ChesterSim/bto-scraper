require('dotenv').config();
const puppeteer = require('puppeteer');
const fsPromises = require('fs').promises;

const db = require('./db.json');

const blocks = [
  '222A',
  '222B',
  '223A',
  '223B',
  '223C',
  '224A',
  '224B',
  '224C',
  '233A',
  '233B',
  '233C',
];

module.exports.scrape = async () => {
  const pageUrl = `https://services2.hdb.gov.sg/webapp/BP13AWFlatAvail/BP13EBSFlatSearch?Town=Toa+Payoh&Flat_Type=BTO&selectedTown=Toa+Payoh&Flat=4-Room&ethnic=Y&ViewOption=A&projName=A&Block=0&DesType=A&EthnicA=Y&EthnicM=&EthnicC=&EthnicO=&numSPR=&dteBallot=202011&Neighbourhood=&Contract=&BonusFlats1=N&searchDetails=Y&brochure=true`;

  const puppeteerConfig =
    process.env.NODE_ENV === 'development'
      ? {}
      : {
        executablePath: '/usr/bin/chromium-browser',
        headless: true,
        args: ['--no-sandbox'],
      };

  const browser = await puppeteer.launch(puppeteerConfig);
  const page = await browser.newPage();
  await page.goto(pageUrl);

  let availableUnits = {};

  for (let i = 0; i < 6; i++) {
    await getAvailableUnits(page, availableUnits, i, true);
  }

  await getAvailableUnits(page, availableUnits, 6, false);

  await browser.close();

  const numOfHighUnits = calcHighUnits(availableUnits);
  db.highUnitsLeft = numOfHighUnits;
  db.highUnitsLeftUpdatedAt = Date.now();

  await fsPromises.writeFile("./db.json", JSON.stringify(db));

  return numOfHighUnits;
};

const calcHighUnits = (availableUnits) => {
  let total = 0;
  Object.keys(availableUnits).forEach((block) => {
    availableUnits[block].map((unit) => {
      const floor = parseInt(unit.slice(1).split('-')[0]);
      if (floor > 5) {
        total++;
      }
    });
  });

  return total;
};

const getAvailableUnits = async (
  page,
  availableUnits,
  blockIndex,
  firstRow,
) => {
  try {
    if (firstRow) {
      await page.click(
        `#blockDetails > div:nth-child(1) > table > tbody > tr:nth-child(1) > td:nth-child(${blockIndex + 1
        }) > div`,
      );
    } else {
      await page.click(
        `#blockDetails > div:nth-child(1) > table > tbody > tr:nth-child(2) > td:nth-child(${blockIndex - 5
        }) > div`,
      );
    }

    await page.waitForNavigation({ waitUntil: 'networkidle0' });

    const data = await page.evaluate(() => {
      const availableUnitElements = Array.from(
        document.querySelectorAll('table tr td font a font'),
      );
      return availableUnitElements.map((td) => td.innerText);
    });

    availableUnits[blocks[blockIndex]] = data.filter((e) => e.includes('#'));
  } catch (err) {
    console.log('Error at block', blocks[blockIndex]);
    console.log(err.message);
  }
};
