const puppeteer = require('puppeteer')
const request = require("request");

function crop(number, digits, type){
    const _digits = Number(1 + Array(digits).fill(0).join(''))
    if (type === 'ceil') return Math.ceil(number * _digits) / _digits
    if (type === 'floor') return Math.floor(number * _digits) / _digits
}
function delay(time) {
    return new Promise(function(resolve) {
        setTimeout(resolve, time)
    });
}
async function check() {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage()
    await page.goto('https://steamcommunity.com/market/listings/570/Shoulders%20of%20the%20Slain%20Dragon')
    await delay(4000);
    await page.click('#searchResults_links > span:nth-child(7)')
    await delay(4000);
    /* Run javascript inside the page */
    const hotels = await page.$$eval('.market_listing_price_with_fee', anchors => {
        return anchors.map(anchor => anchor.textContent.trim().replace('$', "").replace('USD', "").replace(',', ""))

    })
    const lastItem = hotels[hotels.length - 1]
    console.log('all ' + hotels)
    console.log('mine ' + lastItem);
    const b = 49500 / lastItem
    const c = crop(b, 2, 'floor')
    console.log('b ' + b);
    console.log('с ' + c);
    let uri = 'https://api.telegram.org/bot5170808901:AAEb8fqekp8sW8bmVEbd8g_9s_YKRLVLZks/sendMessage?chat_id=342249156&text=Курс доллара в стиме: ' + c;
    let encoded = encodeURI(uri);
    request.get(encoded)

    await delay(4000);
    //const innerText = await page.evaluate(() => document.querySelector('.market_listing_price_with_fee').textContent.trim().replace('$', "").replace('USD', ""));


    await delay(44000);

     await browser.close()
}
setInterval(check, 10000);
