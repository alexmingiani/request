const puppeteer = require('puppeteer');

exports.handler = async (event) => {
    const url = event.queryStringParameters.url;

    if (!url) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Please provide a URL as a query parameter." }),
        };
    }

    try {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();
        await page.goto(url);
        const screenshot = await page.screenshot({ encoding: 'base64' });

        await browser.close();

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'image/png' },
            body: screenshot,
            isBase64Encoded: true,
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
