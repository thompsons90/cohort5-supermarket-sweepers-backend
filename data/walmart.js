require('dotenv').config();
// const puppeteer = require('puppeteer');
const puppeteer = require('puppeteer-extra');

const fs = require('fs');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

getWalmartChickenData = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  let tempMeatData = [];
  let pageLength;

  console.log('Chicken Page Opening');
  await page.goto(`https://www.walmart.com/search?q=chicken&page=1&affinityOverride=store_led`, {
    waitUntil: 'networkidle2',
  });
  console.log('Page Opened');

  ///Finds number of pages scraper needs to run on
  if (
    (await page.$(
      '.sans-serif.ph1.pv2.w4.h4.lh-copy.border-box.br-100.b--solid.mh2-m.db.tc.no-underline.gray.bg-white.b--white-90',
    )) !== null
  ) {
    //If class is available, then the content of this class will be used to determine iterations
    pageLength = parseInt(
      await page.evaluate(
        (el) => el.innerText,
        await page.$(
          '.sans-serif.ph1.pv2.w4.h4.lh-copy.border-box.br-100.b--solid.mh2-m.db.tc.no-underline.gray.bg-white.b--white-90',
        ),
      ),
    );
  } else {
    //Length is based off of number of elements when missing a certain class on the page
    pageLength =
      (await page.$$eval(
        '.sans-serif.ph1.pv2.w4.h4.lh-copy.border-box.br-100.b--solid.mh2-m.db.tc.no-underline.black.bg-white.b--white-90',
        (divs) => divs.length,
      )) + 1;
  }

  ///Loop through all pages on search query
  for (let i = 1; i < pageLength + 1; i++) {
    await page.goto(`https://www.walmart.com/search?q=chicken&page=${i}&affinityOverride=store_led`, {
      waitUntil: 'networkidle2',
    });
    console.log(i);

    ///Creates an array of strings the holds all textContent of each div
    let items = await page.$$eval('.mb1.ph1.pa0-xl.bb.b--near-white.w-33', (divs) =>
      divs.map((text) => text.textContent),
    );

    ///Parse through the array of strings to find each piece of information needed fot the JSON file
    await items.map((item) => {
      let pricePerPound = getPricePerPound(item);
      let meatName = getMeatName(item);
      let meatOption;

      if (meatName.includes('breast') || meatName.includes('Breast')) {
        meatOption = 'breast';
        // console.log(item)
      }
      if (
        meatName.includes('leg') ||
        meatName.includes('Leg') ||
        meatName.includes('drum') ||
        meatName.includes('Drum') ||
        meatName.includes('Thigh') ||
        meatName.includes('thigh')
      ) {
        meatOption = 'thighs';
        // console.log(item)
      }

      if (meatOption !== undefined) {
        tempMeatData.push({
          name: meatName,
          pricePerLb: parseFloat(pricePerPound),
          store: 'walmart',
          category: 'meat',
          type: 'pork',
          option: meatOption,
        });
      }
    });
  }
  await browser.close();

  ///End of loop return data
  return tempMeatData;
};

///Function that returns an array of pork data
getWalmartPorkData = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  let tempMeatData = [];
  let pageLength;

  console.log('Pork Page Opening');
  await page.goto(`https://www.walmart.com/search?q=pork&page=1&affinityOverride=store_led`, {
    waitUntil: 'networkidle2',
  });
  console.log('Page Opened');

  ///Finds number of pages scraper needs to run on
  if (
    (await page.$(
      '.sans-serif.ph1.pv2.w4.h4.lh-copy.border-box.br-100.b--solid.mh2-m.db.tc.no-underline.gray.bg-white.b--white-90',
    )) !== null
  ) {
    //If class is available, then the content of this class will be used to determine iterations
    pageLength = parseInt(
      await page.evaluate(
        (el) => el.innerText,
        await page.$(
          '.sans-serif.ph1.pv2.w4.h4.lh-copy.border-box.br-100.b--solid.mh2-m.db.tc.no-underline.gray.bg-white.b--white-90',
        ),
      ),
    );
  } else {
    //Length is based off of number of elements when missing a certain class on the page
    pageLength =
      (await page.$$eval(
        '.sans-serif.ph1.pv2.w4.h4.lh-copy.border-box.br-100.b--solid.mh2-m.db.tc.no-underline.black.bg-white.b--white-90',
        (divs) => divs.length,
      )) + 1;
  }

  ///Loop through all pages on search query
  for (let i = 1; i < pageLength + 1; i++) {
    await page.goto(`https://www.walmart.com/search?q=pork&page=${i}&affinityOverride=store_led`, {
      waitUntil: 'networkidle2',
    });
    console.log(i);

    ///Creates an array of strings the holds all textContent of each div
    let items = await page.$$eval('.mb1.ph1.pa0-xl.bb.b--near-white.w-33', (divs) =>
      divs.map((text) => text.textContent),
    );

    ///Parse through the array of strings to find each piece of information needed fot the JSON file
    await items.map((item) => {
      let pricePerPound = getPricePerPound(item);
      let meatName = getMeatName(item);
      let meatOption;

      if (meatName.includes('chop') || meatName.includes('Chop')) {
        meatOption = 'porkchop';
      }
      if (
        (meatName.includes('bacon') || meatName.includes('Bacon')) &&
        (!meatName.includes('bits') ||
          !meatName.includes('Bits') ||
          !meatName.includes('Brat') ||
          !meatName.includes('brat') ||
          !meatName.includes('patties') ||
          !meatName.includes('patties'))
      ) {
        meatOption = 'bacon';
      }

      if (meatOption !== undefined) {
        tempMeatData.push({
          name: meatName,
          pricePerLb: parseFloat(pricePerPound),
          store: 'walmart',
          category: 'meat',
          type: 'pork',
          option: meatOption,
        });
      }
    });
  }
  await browser.close();

  ///End of loop return data
  return tempMeatData;
};

const getWalmartGroundBeefData = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  let tempMeatData = [];
  let pageLength;

  console.log('Beef Page Opening');
  await page.goto(`https://www.walmart.com/search?q=ground+beef&typeahead=beef&page=1&affinityOverride=store_led`, {
    waitUntil: 'networkidle2',
  });
  console.log('Page Opened');

  ///Finds number of pages scraper needs to run on
  if (
    (await page.$(
      '.sans-serif.ph1.pv2.w4.h4.lh-copy.border-box.br-100.b--solid.mh2-m.db.tc.no-underline.gray.bg-white.b--white-90',
    )) !== null
  ) {
    //If class is available, then the content of this class will be used to determine iterations
    pageLength = parseInt(
      await page.evaluate(
        (el) => el.innerText,
        await page.$(
          '.sans-serif.ph1.pv2.w4.h4.lh-copy.border-box.br-100.b--solid.mh2-m.db.tc.no-underline.gray.bg-white.b--white-90',
        ),
      ),
    );
  } else {
    //Length is based off of number of elements when missing a certain class on the page
    pageLength =
      (await page.$$eval(
        '.sans-serif.ph1.pv2.w4.h4.lh-copy.border-box.br-100.b--solid.mh2-m.db.tc.no-underline.black.bg-white.b--white-90',
        (divs) => divs.length,
      )) + 1;
  }

  ///Loop through all pages on search query
  for (let i = 1; i < pageLength + 1; i++) {
    await page.goto(
      `https://www.walmart.com/search?q=ground+beef&typeahead=beef&page=${i}&affinityOverride=store_led`,
      {
        waitUntil: 'networkidle2',
      },
    );
    console.log(i);

    ///Creates an array of strings the holds all textContent of each div
    let items = await page.$$eval('.mb1.ph1.pa0-xl.bb.b--near-white.w-33', (divs) =>
      divs.map((text) => text.textContent),
    );

    ///Parse through the array of strings to find each piece of information needed fot the JSON file
    await items.map((item) => {
      let pricePerPound = getPricePerPound(item);
      let meatName = getMeatName(item);
      let meatOption;

      if ((meatName.includes('80') && meatName.includes('20')) || meatName.includes('80%')) {
        meatOption = '80/20';
      }
      if (meatName.includes('93') && meatName.includes('7')) {
        meatOption = '93/7';
      }

      if (meatOption !== undefined) {
        tempMeatData.push({
          name: meatName,
          pricePerLb: parseFloat(pricePerPound),
          store: 'walmart',
          category: 'meat',
          type: 'groundBeef',
          option: meatOption,
        });
      }
    });
  }
  await browser.close();

  ///End of loop return data
  return tempMeatData;
};

function getMeatName(item) {
  return item.substring(0, item.indexOf('lb') + 2);
}

function getPricePerPound(item) {
  let positionOfPricePerPound = getPositionOfNthElement(item, '$', 3);
  let stringAfterMoney = item.substring(positionOfPricePerPound);
  let indexOfDecimal = stringAfterMoney.indexOf('.');

  if (parseFloat(stringAfterMoney.substring(1, indexOfDecimal + 3)).toFixed(2) === null) {
    positionOfPricePerPound = getPositionOfNthElement(item, '$', 2);
    stringAfterMoney = item.substring(positionOfPricePerPound);

    return parseFloat(stringAfterMoney.substring(1, indexOfDecimal + 3)).toFixed(2);
  }

  ///Returns float of just the price
  return parseFloat(stringAfterMoney.substring(1, indexOfDecimal + 3)).toFixed(2);
}

function getPositionOfNthElement(str, subStr, i) {
  return str.split(subStr, i).join(subStr).length;
}

///Click to get rid of opening modal
// await page.waitForSelector('.absolute.bg-white.br3.br--bottom.bg-blue.z-3.br4.ph4-m.pt4.pb3.gic-drawer', {visible: false})
// await page.click('.absolute.absolute--fill.bg-black-40.z-2');
// console.log("clicked")

///Currently a logger function
let writeDataToJSON = async () => {
  let porkData = await getWalmartPorkData();
  let groundBeefData = await getWalmartGroundBeefData();
  let chickenData = await getWalmartChickenData();

  let combinedData = porkData.concat(groundBeefData).concat(chickenData);

  fs.writeFileSync(__dirname + '/walmartJSON.json', JSON.stringify(combinedData));
};

writeDataToJSON();
