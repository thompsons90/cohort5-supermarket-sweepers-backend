require('dotenv').config();
const puppeteer = require('puppeteer-extra');

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
    let name, unitSize, totalPrice;

    try {
      totalPrice = await beefCards[i].$eval('[data-qa="cart-page-item-unit-price"]', (el) => el.getAttribute('value'));
      name = await beefCards[i].$eval('[data-qa="cart-page-item-description"]', (el) => el.textContent);
      unitSize = await beefCards[i].$eval('[data-qa="cart-page-item-sizing"]', (el) => el.textContent);
    } catch (err) {
      console.log(err);
    }

    if (name && unitSize && totalPrice) {
      beefData.push({
        name,
        unitSize,
        totalPrice,
        pricePerOz: 'fill in later',
        store: 'kroger',
        mainCategory: 'meat',
        minorCategory: 'beef',
      });
    }
  }

  console.log(beefData);

  // console.log(beefCards);

  // beefCards.forEach(async (card) => {
  //   let beefProductData = {};

  //   let totalPrice = await card.$eval('[data-qa="cart-page-item-unit-price"]', (el) => el.value);
  //   beefProductData.totalPrice = totalPrice;

  //   beefData.push(beefProductData);
  // });

  // console.log('beefData', beefData);
  // <div class="kds-Card ProductCard border-default-300 border-solid border w-full flex flex-col overflow-hidden px-8 pb-16 shadow-4" data-qa="product-card-0">
  // <div class="absolute pin-r flex mr-8 -mt-4"></div>
  // <div class="mb-4 mx-auto mt-24 h-152 w-152 text-center" data-qa="cart-page-item-image">
  // <a aria-label="Kroger® 80/20 Ground Beef Roll" href="/p/kroger-80-20-ground-beef-roll/0001111097971?fulfillment=PICKUP" class="kds-Link kds-Link--inherit">
  // <div class="h-full flex flex-wrap flex-col kds-Image-container overflow-hidden h-full w-full items-center justify-center" aria-busy="false">
  // <img role="presentation" data-qa="cart-page-item-image-loaded" src="https://www.kroger.com/product/images/medium/front/0001111097971" alt="Kroger® 80/20 Ground Beef Roll" loading="eager" class="kds-Image-img"></div></a></div><div class="flex justify-between items-center mb-8"><data value="2.99" typeof="Price" class="kds-Price kds-Price--alternate" data-qa="cart-page-item-unit-price">
  // <meta name="priceCurrency" content="USD"><mark class="kds-Price-promotional kds-Price-promotional--decorated"><sup class="kds-Price-superscript">$</sup><span class="kds-Price-promotional-dropCaps">2</span><sup class="kds-Price-superscript"><span class="screen-reader">.</span>99</sup></mark><span class="screen-reader"> discounted from </span><s class="kds-Price-original">$4.79</s></data></div>
  // <div class="flex-grow w-full h-64"><a class="kds-Link kds-Link--inherit kds-Link--implied ProductDescription-truncated overflow-hidden" aria-label="Kroger® 80/20 Ground Beef Roll title" href="/p/kroger-80-20-ground-beef-roll/0001111097971?fulfillment=PICKUP"><h3 class="kds-Text--l text-default-900 font-secondary font-500 mt-8 mb-0" data-qa="cart-page-item-description">Kroger® 80/20 Ground Beef Roll</h3></a><div><span class="kds-Text--s text-default-700" data-qa="cart-page-item-sizing">1 lb</span></div></div><div class="mt-32"><div class="flex flex-col"></div><div><button class="kds-Button kds-Button--primary kds-Button--compact AddItemSignInBtn mb-8 md:mb-0 w-full">Sign In to Add</button></div></div></div>

  // await page.waitForSelector('#ExposedMenu-Category-Departments');
  // await page.click('#ExposedMenu-Category-Departments');

  // await page.waitForSelector('#ExposedMenuTextLink-Meat');
  // await page.click('#ExposedMenuTextLink-Meat');

  // await page.$eval('#SignIn-emailInput', (el, email) => (el.value = email));
  // await closeBtn.click();
};

getKrogerData();
