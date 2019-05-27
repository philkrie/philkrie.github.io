---
layout: post
title: "Using Puppeteer to Extract Code Coverage Data from Chrome Dev Tools"
excerpt: The Chrome Coverage tool shows your untouched code, but you want to download the good stuff
keywords: Chrome, chromium, puppeteer, performance, code, coverage, minification, unused, CSS, JS, HTML
---

<amp-img width="290" height="422" layout="fixed" src="/assets/posts/extracting-coverage/puppeteer.png"></amp-img>
<br/>
<caption>*Become a puppet master, only significantly less creepy*</caption>

#### TL;DR: Use the Puppeteer node module to extract the CSS and JS that you are actually using on the initial load of the site

The Chrome browser comes with a number of powerful developer options, accessible within the Developer Tools. Review the source code of any site, gauge performance, and modify CSS in real time: it's some powerful stuff! 

Hidden away in the bottom drawer is a great tool for determining the amount of extraneous code on your website. The **coverage** tool (hidden by default, so click the 3 dot menu) shows you how much each file is actually used. Take a look at your site. I bet you your CSS file is >90% unused on first load, isn't it? Well if it is, then you're in the same boat as the vast majority of sites on the web.

<amp-img width="938" height="562" layout="responsive" src="/assets/posts/extracting-coverage/coverage.png"></amp-img>
<caption>*The location of the coverage tool*</caption>

In an ideal world, we use only what we need. Every single bit of information brought over the wire has a place and purpose for creating the user experience. This is obviously impossible for a variety of reasons, mostly having to do with the exorbitant development time it would take to make sure each release introduces not a **single** line of redundant code. It feels like CSS and JS in particular just build up until several months later you have a file that is too large and complicated to bother reusing old styles or functions. So you add more code, and on and on.

I really do think we can do better than downloading an extraneous 90% of a file just to render the initial view of a page. It is important to remember that the download and parsing of every bit of synchronous CSS and JS is [renderblocking](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-blocking-css), whether it's used or not.

In this post, I will demonstrate a method for extracting your used CSS and JS and creating a new file that you can then examine or potentially utilize for inlining critical CSS and JS for ATF content.

First, we are going to have to download the [Puppeteer node module](https://github.com/GoogleChrome/puppeteer). I recommend using npm to install it, as described in the Github page.

Puppeteer is a node module that acts as an API for the Chrome Developer Tools. You can do anything that the tools can, and more, because now you have access to the objects that operate under the hood. Puppeteer runs everything in a headless Chrome instance, so you know you'll be rendering things the same way you do in the Chrome browser.

Once you bring the puppeteer module into your node file, you can use it to start "recording" JS and CSS usage for pages that you go to using the headless Chromium instance that Puppeteer spins up. You then stop recording, and iterate through the resulting coverage object.

The code sample below visits a page and retrieves the JS and CSS coverage objects.

```javascript
const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await Promise.all([
        page.coverage.startJSCoverage(),
        page.coverage.startCSSCoverage()
    ]);

    await page.goto('https://www.google.com');
  
    //Retrive the coverage objects
    const [jsCoverage, cssCoverage] = await Promise.all([
        page.coverage.stopJSCoverage(),
        page.coverage.stopCSSCoverage(),
    ]);
    
    await browser.close();
})();
```

You can also tell puppeteer to load the page in an emulated mobile browser. In fact, I encourage you to explore all of the possiblities of the puppeteer module, you can do quite a bit.

```javascript
const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const iPhone = devices['iPhone 6'];

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.emulate(iPhone);
    await page.goto('https://www.google.com');
    // other actions...
    await browser.close();
});
```

In the below example, what we would like to do is extract the used CSS and generate a new CSS file, one that we could perhaps use to speed up the development of an AMP page, for example, which can only use styles defined in the head of the HTML page. 

```javascript
const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
//Include to be able to export files w/ node
const fs = require('fs');
const iPhone = devices['iPhone 6'];

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.emulate(iPhone);

    //Begin collecting CSS coverage data
    await Promise.all([
        page.coverage.startCSSCoverage()
    ]);

    //Visit desired page
    await page.goto('https://www.google.com');
  
    //Stop collection and retrieve the coverage iterator
    const cssCoverage = await Promise.all([
        page.coverage.stopCSSCoverage(),
    ]);

    //Investigate CSS Coverage and Extract Used CSS
    const css_coverage = [...cssCoverage];
    let css_used_bytes = 0;
    let css_total_bytes = 0;
    let covered_css = "";
    for (const entry of css_coverage[0]) {
        css_total_bytes += entry.text.length;
        console.log(`Total Bytes for ${entry.url}: ${entry.text.length}`);
        for (const range of entry.ranges){
            css_used_bytes += range.end - range.start - 1;
            covered_css += entry.text.slice(range.start, range.end) + "\n";
        }       
    }

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
```

This method can easily be extended to JS files, though if we are creating an AMP page, we can't use those anyways. This method should make creating a base style for your AMP pages quite simple. Simply take the CSS code in the file and insert in the head. Or use it to rebuild your site CSS by getting a new base to expand from.