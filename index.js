const puppeteer = require('puppeteer');
const request = require('request');
require('dotenv').config();
async function run() {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();

    while (true) {
        await page.goto('https://steamcommunity.com/market/listings/570/Shoulders%20of%20the%20Slain%20Dragon');
        await page.waitForTimeout(9000);
        await page.click('#searchResults_links > span:nth-child(7)');
        await page.waitForTimeout(9000);

        await page.screenshot({ path: 'buddy-screenshot.png' });

        const prices = await page.$$eval('.market_listing_price_with_fee', anchors => {
            return anchors.map(anchor => parseFloat(anchor.textContent.trim().replace(/[$,]/g, '').replace('USD', '')));
        });

        const lastPrice = prices[prices.length - 1];
        const exchangeRate = 12696.86 / lastPrice;
        const roundedExchangeRate = Math.floor(exchangeRate * 100) / 100;

        console.log(`All prices: ${prices}`);
        console.log(`Last price: ${lastPrice}`);
        console.log(`Exchange rate: ${exchangeRate}`);
        console.log(`Rounded exchange rate: ${roundedExchangeRate}`);

        const uri = process.env.KEY+roundedExchangeRate;
        request.get(encodeURI(uri));

        await page.waitForTimeout(50000000);
    }

    await browser.close();
}

run();
