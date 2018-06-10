const { expect } = require('chai');
const { test } = require('./setup/browser');

const data = require('./../dataServer/data1.json');
// console.log(data);

describe('index', () => {
    it('should contain all used tags', test(async (browser, opts) => {
        const page = await browser.newPage();
        await page.goto(`${opts.appUrl}`);
        const checks = {
            header: 1,
            span: 1,
            a: 2,
            br: 1,
            div: 2,
            h2: 1,
            sub: 1,
            img: 1,
            canvas: 1,
            script: 2
        };
        let tmp = null;
        for (let tag in checks) {
            tmp = await page.$$eval(`body ${tag}`, d => d.length);
            expect(tmp).to.be.equal(checks[tag]);
        }
    }));

    it('data from json should match data on page', test(async (browser, opts) => {
        const page = await browser.newPage();
        await page.goto(`${opts.appUrl}`);    

        let tmp = await page.$eval('h2', d => d.innerText);
        expect(tmp).to.be.equal(data.title + data.version);

        tmp = await page.$eval('p', d => d.innerText);
        expect(tmp).to.be.equal(data.content);
    }));
    
});
