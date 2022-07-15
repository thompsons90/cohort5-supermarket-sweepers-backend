require('dotenv').config();
const puppeteer = require('puppeteer');
const fs = require('fs');



getWalmartPorkData = async () =>{
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    console.log("Page Opening")
    await page.goto('https://www.walmart.com/search?q=beef', {
        waitUntil: 'networkidle2',
      });
    console.log("Page Opened")

    ///Click to get rid of opening modal
    await page.click('.absolute .absolute--fill .bg-black-40 .z-2');
    console.log("clicked")

    const n = await page.$(".flex .flex-wrap .w-100 .flex-grow-0 .flex-shrink-0 .ph2 .pr0-xl .pl4-xl .mt0-xl .mt3 > div")
    const t = await (await n.getProperty('textContent')).jsonValue()

    console.log(t)
}

const getWalmartBeefData = async () =>{

}



const testGet = async () =>{
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();


    ///Open Weather Website
    console.log("Page Opening")
    await page.goto('https://vastagon.github.io/weather-app/', {
        waitUntil: 'networkidle2',
      });
    console.log("Page Opened")

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    // await page.evaluate(() => console.log(`url is ${location.href}`));
    

    
    page.evaluate(() => {

        let element = document.querySelector('.weather')
        return element.innerText
    
    }).then(text => {
        console.log(text)
    })




    ///Get Weather Data
    // const n = await page.$(".weather > .weather-section > .weather-section-left > p")
    // const n = await page.$(".weather-block")

    // const t = await (await n.getProperty('textContent')).jsonValue()
    

    // console.log(t)
}

// getWalmartPorkData()

testGet()