require('dotenv').config();
const puppeteer = require('puppeteer');
const fs = require('fs');

let email = process.env.EMAIL;
let password = process.env.KROGER_PASSWORD;

// <button data-qa="SignIn-submitButton" id="SignIn-submitButton" class="kds-Button kds-Button--primary w-full my-8" type="submit">Sign In</button>

const getKrogerData = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://www.kroger.com/signin?redirectUrl=', {
    waitUntil: 'networkidle2',
  });

  console.log('browser opened');
  console.log('email', email);

  // await page.waitForSelector('[data-testid*="CurrentModality-vanityName"]');
  // const locationSearchInput = await page.$('[data-testid*="CurrentModality-vanityName"]');
  // console.log('input', locationSearchInput);
  await page.waitForSelector('#SignIn-emailInput');
  await page.type('#SignIn-emailInput', email);
  await page.type('#SignIn-passwordInput', password);
  await page.click('#SignIn-submitButton');
  // const emailInput = await page.$('#SignIn-emailInput');
  // console.log('closeBtn', emailInput);

  console.log('signed in');

  // await page.$eval('#SignIn-emailInput', (el, email) => (el.value = email));
  // await closeBtn.click();
};

getKrogerData();
