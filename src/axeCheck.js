const puppeteer = require('puppeteer');
const { AxePuppeteer } = require('@axe-core/puppeteer');

let browserInstance = null;

async function getBrowserInstance() {
    if (browserInstance === null) {
        browserInstance = await puppeteer.launch({ headless: true });
    }
    return browserInstance;
}

async function runAxeCheck(htmlContent) {
    const browser = await getBrowserInstance();
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    const axe = new AxePuppeteer(page);
    const results = await axe.analyze();
    await page.close(); // Close the page but keep the browser open
    return results;
}

async function closeBrowserInstance() {
    if (browserInstance !== null) {
        await browserInstance.close();
        browserInstance = null;
    }
}

module.exports = { runAxeCheck, closeBrowserInstance };
