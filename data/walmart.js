require('dotenv').config();
const puppeteer = require('puppeteer');
const fs = require('fs');


getWalmartPorkData = async () =>{

}

const getWalmartBeefData = async () =>{
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    console.log("Page Opening")
    await page.goto('https://www.walmart.com/search?q=beef', {
        waitUntil: 'networkidle2',
        });
    console.log("Page Opened")

    ///Click to get rid of opening modal
    await page.waitForSelector('.absolute.bg-white.br3.br--bottom.bg-blue.z-3.br4.ph4-m.pt4.pb3.gic-drawer', {visible: false})
    await page.click('.absolute.absolute--fill.bg-black-40.z-2');
    console.log("clicked")


    ///Creates an array of strings the holds all textContent of each div
    let items = await page.$$eval(".mb1.ph1.pa0-xl.bb.b--near-white.w-33", divs => divs.map(text => text.textContent))

    let tempMeatData = []

    ///Parse through the array of strings to find each piece of information needed fot the JSON file
    items.map(item => {
        let pricePerPound = getPricePerPound(item)
        let meatName = getMeatName(item)
        let averagePrice = getAveragePrice(item)


        tempMeatData.push({
            "totalPrice": parseFloat((averagePrice * 1).toFixed(2)),
            "pricePerOz": parseFloat((pricePerPound / 16).toFixed(2)),
            "name": meatName,
            "store": "walmart",
            "mainCategory": "meat",
            "minorCategory": "beef"  
        })
    })


    function getMeatName(item){
        return item.substring(0,item.indexOf("lb")+2)
    }

    function getPricePerPound(item){
        let positionOfPricePerPound = getPositionOfNthElement(item,"$",3)
        let stringAfterMoney = item.substring(positionOfPricePerPound)
        let indexOfDecimal = stringAfterMoney.indexOf(".")

        ///Returns float of just the price
        return parseFloat(stringAfterMoney.substring(1,indexOfDecimal+3)).toFixed(2)
    }

    function getAveragePrice(item){
        let indexOfSubstring = item.indexOf("$")
        let stringAfterMoney = item.substring(indexOfSubstring)
        let indexOfDecimal = stringAfterMoney.indexOf(".")

        ///Returns float of just the price
        return parseFloat(stringAfterMoney.substring(1,indexOfDecimal+3)).toFixed(2)
    } 

    function getPositionOfNthElement(str, subStr, i) {
        return str.split(subStr, i).join(subStr).length;
    }

    return tempMeatData
}

///Currently a logger function
let writeDataToJSON = async () =>{
    let logged = await getWalmartBeefData()
    console.log(logged)
}

writeDataToJSON()