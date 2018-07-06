const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const fs = require('fs');
const iPhone = devices['iPhone 6'];

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.emulate(iPhone);

    await Promise.all([
        page.coverage.startJSCoverage(),
        page.coverage.startCSSCoverage()
    ]);

    await page.goto('https://news.ycombinator.com');
  
    const [jsCoverage, cssCoverage] = await Promise.all([
        page.coverage.stopJSCoverage(),
        page.coverage.stopCSSCoverage(),
    ]);

    //Investigate CSS Coverage and Extract Used CSS
    const css_coverage = [...cssCoverage];
    let css_used_bytes = 0;
    let css_total_bytes = 0;
    let covered_css = "";
    for (const entry of css_coverage) {
        css_total_bytes += entry.text.length;
        console.log(`Total Bytes for ${entry.url}: ${entry.text.length}`);
        for (const range of entry.ranges){
            css_used_bytes += range.end - range.start - 1;
            covered_css += entry.text.slice(range.start, range.end) + "\n";
        }       
    }
    console.log(`Covered CSS: \n ${covered_css}`);
    console.log(`Total Bytes of CSS: ${css_total_bytes}`);
    console.log(`Used Bytes of CSS: ${css_used_bytes}`);

    fs.writeFile("./exported_css.css", covered_css, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 

    await browser.close();
})();