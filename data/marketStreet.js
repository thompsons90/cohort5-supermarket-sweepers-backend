require('dotenv').config();
const puppeteer = require('puppeteer');
const fs = require('fs');

const getMarketStreetMeatData = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  console.log('browser started');
  await page.goto(process.env.MARKET_STREET_URL, {
    waitUntil: 'networkidle2',
  });

  await page.click('.store-options a:last-child');
  await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

  const addBtn = await page.$('#NextWekklyAdBtn');
  await addBtn.click();
  await page.waitForNavigation();

  const viewAllBtns = await page.$$('.list-items-txt-view-all');
  await viewAllBtns[0].click();
  await page.waitForNavigation();

  const data = await page.evaluate(() => {
    let itemTitles = document.querySelectorAll('.item-title');
    let itemSizes = document.querySelectorAll('.item-size');
    let itemPrices = document.querySelectorAll('.text-price strong');

    let meatData = [];

    itemTitles.forEach((title, index) => {
      meatData.push({
        itemName: itemTitles[index].innerHTML,
        itemSize: itemSizes[index].innerHTML,
        itemPrices: itemPrices[index].innerHTML,
      });
    });

    return { meatData };
  });

  fs.writeFileSync('groceryData.json', JSON.stringify(data));
  console.log(data);
  await browser.close();
};

const getMSMeatData = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  console.log('browser started');
  await page.goto(process.env.MARKET_STREET_URL, {
    waitUntil: 'networkidle2',
  });

  await page.click('.store-options a:last-child');
  await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

  const addBtn = await page.$('#NextWekklyAdBtn');
  await addBtn.click();
  await page.waitForNavigation();

  await page.goto('https://www.marketstreetunited.com/rs/departments/meat/4003696/hamburger-meat/4004601', {
    waitUntil: 'networkidle2',
  });

  await page.screenshot({ path: 'test.png' });

  const data = await page.evaluate(() => {
    let itemTitles = document.querySelectorAll('.item-title');
    let itemSizes = document.querySelectorAll('.item-size');
    let itemPrices = document.querySelectorAll('.text-saving-dark strong');

    let meatData = [];

    itemTitles.forEach((title, index) => {
      meatData.push({
        name: itemTitles[index].innerHTML,
        size: itemSizes[index].innerHTML,
        prices: itemPrices[index].innerHTML,
        store: 'marketStreet',
        category: 'groundBeef',
      });
    });

    return meatData;
  });

  console.log(data);

  fs.writeFileSync('groceryData.json', JSON.stringify(data));

  await browser.close();
};

exports.getMarketStreetMeatData = getMarketStreetMeatData;
exports.getMSMeatData = getMSMeatData;
