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

  await page.goto('https://www.kroger.com/pl/beef/05001', {
    waitUntil: 'networkidle2',
  });

  console.log('on beef page');

  const beefCards = await page.$$('.kds-Card');
  let beefData = [];

  for (let i = 0; i < beefCards.length; i++) {
    let name, unitSize, totalPrice, pricePerOz;

    try {
      totalPrice = await beefCards[i].$eval('[data-qa="cart-page-item-unit-price"]', (el) => el.getAttribute('value'));
      totalPrice = Number(totalPrice);
      name = await beefCards[i].$eval('[data-qa="cart-page-item-description"]', (el) => el.textContent);
      unitSize = await beefCards[i].$eval('[data-qa="cart-page-item-sizing"]', (el) => el.textContent);
    } catch (err) {
      console.log(err);
    }

    pricePerOz = calculatePricePerOz(unitSize, totalPrice);

    if (name && unitSize && totalPrice) {
      beefData.push({
        name,
        unitSize,
        totalPrice,
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
