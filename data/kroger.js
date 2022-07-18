require('dotenv').config();
const puppeteer = require('puppeteer-extra');
const fs = require('fs');
const { calculatePricePerOz } = require('../util/dataProcessing');

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

let email = process.env.EMAIL;
let password = process.env.KROGER_PASSWORD;

// <button aria-label="Close pop-up" class="kds-DismissalButton kds-Modal-closeButton"></button>

const getGroceryItemData = async (page, targetURL, mainCategory, minorCategory) => {
  await page.goto(targetURL, {
    waitUntil: 'networkidle2',
  });

  const groceryItemCards = await page.$$('.kds-Card');
  console.log('groceryItemCards', groceryItemCards);
  let groceryItemData = [];

  for (let i = 0; i < groceryItemCards.length; i++) {
    let name, unitSize, totalPrice, pricePerOz;

    try {
      // Total price returns undefined sometimes
      totalPrice = await groceryItemCards[i].$eval('[data-qa="cart-page-item-unit-price"]', (el) =>
        el.getAttribute('value'),
      );
      name = await groceryItemCards[i].$eval('[data-qa="cart-page-item-description"]', (el) => el.textContent);
      unitSize = await groceryItemCards[i].$eval('[data-qa="cart-page-item-sizing"]', (el) => el.textContent);
    } catch (err) {
      console.log(err);
    }

    pricePerOz = calculatePricePerOz(unitSize, Number(totalPrice));

    if (name && unitSize && totalPrice) {
      groceryItemData.push({
        name,
        unitSize,
        totalPrice: Number(totalPrice),
        pricePerOz: pricePerOz,
        store: 'kroger',
        mainCategory,
        minorCategory,
      });
    }
  }

  fs.writeFileSync(`${minorCategory}Data.json`, JSON.stringify(groceryItemData));
};

const getKrogerData = async () => {
  const browser = await puppeteer.launch({ args: ['--disable-web-security'], headless: false });
  const page = await browser.newPage();
  await page.goto('https://www.kroger.com/signin?redirectUrl=', {
    waitUntil: 'networkidle2',
  });

  console.log('browser opened');
  console.log('email', email);

  await page.waitForSelector('.kds-DismissalButton');
  await page.click('.kds-DismissalButton');

  console.log('modal closed');

  await page.waitForSelector('#SignIn-emailInput');
  await page.type('#SignIn-emailInput', email);
  await page.type('#SignIn-passwordInput', password);
  await page.click('#SignIn-submitButton');
  await page.waitForSelector('#ExposedMenu-Category-Departments');

  console.log('signed in');

  // await getGroceryItemData(page, 'https://www.kroger.com/pl/beef/05001', 'meat', 'beef');

  await page.goto('https://www.kroger.com/pl/beef/05001', {
    waitUntil: 'networkidle2',
  });

  console.log('on beef page');

  const beefCards = await page.$$('.kds-Card');
  let beefData = [];

  for (let i = 0; i < beefCards.length; i++) {
    let name, unitSize, totalPrice, pricePerOz;

    try {
      // Total price returns undefined sometimes
      totalPrice = await beefCards[i].$eval('[data-qa="cart-page-item-unit-price"]', (el) => el.getAttribute('value'));
      name = await beefCards[i].$eval('[data-qa="cart-page-item-description"]', (el) => el.textContent);
      unitSize = await beefCards[i].$eval('[data-qa="cart-page-item-sizing"]', (el) => el.textContent);
    } catch (err) {
      console.log(err);
    }

    pricePerOz = calculatePricePerOz(unitSize, Number(totalPrice));

    if (name && unitSize && totalPrice) {
      beefData.push({
        name,
        unitSize,
        totalPrice: Number(totalPrice),
        pricePerOz: pricePerOz,
        store: 'kroger',
        mainCategory: 'meat',
        minorCategory: 'beef',
      });
    }
  }

  fs.writeFileSync('groceryData.json', JSON.stringify(beefData));
  await browser.close();
};

getKrogerData();
