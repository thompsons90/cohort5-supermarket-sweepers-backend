require('dotenv').config();
const puppeteer = require('puppeteer-extra');
const fs = require('fs');

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

let email = process.env.EMAIL;
let password = process.env.KROGER_PASSWORD;

const getPricePerLb = (totalPrice, unitSize) => {
  let poundRegex = /\d*[\.,]?\d*[^a-zA-Z0-9]*? lbs?/gi;
  let ouncesRegex = /\d*[\.,]?\d*[^a-zA-Z0-9]*? oz/gi;
  let numOnly = /\d*[\.,]?\d[^a-zA-Z0-9]*?/gi;
  let unitSizeAsNum = 0;

  if (unitSize.includes('$') && unitSize.includes('/lb')) {
    return Number(unitSize.slice(1, unitSize.length - 3));
  } else if (unitSize.includes('lb')) {
    let extractedUnitSize = unitSize.match(poundRegex)[0];
    unitSizeAsNum = Number(extractedUnitSize.match(numOnly));
  } else if (unitSize.includes('oz')) {
    let extractedUnitSize = unitSize.match(ouncesRegex)[0];
    unitSizeAsNum = Number(extractedUnitSize.match(numOnly)) / 16;
  }

  if (unitSizeAsNum !== 0) {
    return Math.round((totalPrice / unitSizeAsNum) * 100) / 100;
  }
};

const searchAndExtractData = async (page, searchURL, store, category, type, option) => {
  await page.goto(searchURL, {
    waitUntil: 'networkidle2',
  });

  const itemCards = await page.$$('.kds-Card');
  let itemData = [];

  for (let i = 0; i < itemCards.length; i++) {
    let name, unitSize, totalPrice, onlineOnly;

    try {
      // Total price returns undefined sometimes
      totalPrice = await itemCards[i].$eval('[data-qa="cart-page-item-unit-price"]', (el) => el.getAttribute('value'));
      name = await itemCards[i].$eval('[data-qa="cart-page-item-description"]', (el) => el.textContent);
      unitSize = await itemCards[i].$eval('[data-qa="cart-page-item-sizing"]', (el) => el.textContent);
    } catch (err) {
      // console.log(err);
    }

    // Gets rid of ship or delivery only products
    try {
      onlineOnly = await itemCards[i].$eval('.flex .kds-Tag .kds-Tag-text', (el) => el.textContent);
    } catch (err) {
      // console.log(err);
    }

    // Some dog treats come up on bacon search
    if (name && name.toLowerCase().includes('dog treats')) {
      continue;
    }

    if (totalPrice && name && unitSize && !onlineOnly) {
      let pricePerPound = getPricePerLb(Number(totalPrice), unitSize);

      if (pricePerPound) {
        itemData.push({
          name,
          pricePerPound,
          store,
          category,
          type,
          option,
        });
      }
    }
  }

  let data = fs.readFileSync('krogerData.json', 'utf8');
  let currentGroceryData = JSON.parse(data);
  let updatedGroceryData = [...currentGroceryData, ...itemData];

  fs.writeFileSync('krogerData.json', JSON.stringify(updatedGroceryData));
};

const getKrogerData = async () => {
  // const browser = await puppeteer.launch({ args: ['--disable-web-security'], headless: false });
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://www.kroger.com/signin?redirectUrl=', {
    waitUntil: 'networkidle2',
  });

  console.log('browser opened');

  await page.waitForSelector('.kds-DismissalButton');
  await page.click('.kds-DismissalButton');

  console.log('modal closed');

  // Don't always need to log in
  // await page.waitForSelector('#SignIn-emailInput');
  // await page.type('#SignIn-emailInput', email);
  // await page.type('#SignIn-passwordInput', password);
  // await page.click('#SignIn-submitButton');
  // await page.waitForSelector('#ExposedMenu-Category-Departments');

  console.log('signed in');

  fs.writeFileSync('krogerData.json', JSON.stringify([]));

  await searchAndExtractData(
    page,
    'https://www.kroger.com/search?query=ground%20beef%2080%2F20&searchType=default_search',
    'kroger',
    'meat',
    'groundBeef',
    '80/20',
  );
  await searchAndExtractData(
    page,
    'https://www.kroger.com/search?query=ground%20beef%2093%2F7&searchType=default_search',
    'kroger',
    'meat',
    'groundBeef',
    '93/7',
  );

  await searchAndExtractData(
    page,
    'https://www.kroger.com/search?query=chicken%20thighs&searchType=default_search',
    'kroger',
    'meat',
    'chicken',
    'thighs',
  );

  await searchAndExtractData(
    page,
    'https://www.kroger.com/search?query=boneless%20skinless%20chicken%20breast&searchType=default_search',
    'kroger',
    'meat',
    'chicken',
    'breast',
  );

  await searchAndExtractData(
    page,
    'https://www.kroger.com/search?query=pork%20chop%20loin&searchType=default_search',
    'kroger',
    'meat',
    'pork',
    'porkChops',
  );

  await searchAndExtractData(
    page,
    'https://www.kroger.com/search?query=thick%20cut%20bacon&searchType=partials',
    'kroger',
    'meat',
    'pork',
    'bacon',
  );

  await browser.close();
};

getKrogerData();
