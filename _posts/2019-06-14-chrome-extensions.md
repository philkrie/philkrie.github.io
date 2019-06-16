---
layout: post
title: "Chrome Extensions Overview"
excerpt: How to overextend Chrome instead of yourself
keywords: Chrome, Extensions, tools, code, Chrome Webstore, overview, basics, understanding, tutorial, Phillip, Kriegel
---

I do enjoy myself a good Chrome Extension. Finding a new one that does exactly what I've been looking for is always exciting. Some people brush their teeth while they shower to cumulatively save days throughout their lifespans. I install Chrome Extensions. With any luck my life will soon be automated by Chrome Extensions and I will become an omnipotent God.

Chrome Extensions are little applications that make a task in Chrome easier or quicker to do. They're meant to be bite sized, intuitive, and simple to interact with. If you're a developer or are familiar with Chrome, I'm certain none of this is new or surprising. But having gone through the process of building and releasing a Chrome Extension (check out the [AMP Readiness Tool](https://chrome.google.com/webstore/detail/amp-readiness-tool/fadclbipdhchagpdkjfcpippejnekimg?hl=en) on the Chrome Web Store!) I encountered some pitfalls and considerations that I couldn't find concisely documented anywhere else so I'll make an attempt here.

This is adapted from a presentation I gave at work on the topic.

## Chrome Extension Capabilities

To say that Chrome Extensions give you incredible power over the browsing experience is not an overstatement. Chrome Extensions can manipulate anything within a webpage, query information, run tasks in the background, or even modify the behavior of the Chrome browser's UI. You can modify if the Chrome omnibox, generate and download files, make requests to external services, add UI elements and functionality to specific websites, save information and state between page navigation, and much more. It's pretty impressive.

![Thanos Chrome](/assets/posts/chrome-extensions/thanos.png)
*A Chrome Extension realizing that it can do whatever it wants*

Here is a list of the things a Chrome Extension can do

### Input

Direct user input
Remote server calls
Reading the DOM
Intercepting requests
Chrome DevTools
Browser storage

### Output

Anything in G Suite (Apps Script)
New tab
Modification of existing web page
Download a file

### Invocation

Page load/background
User Interaction
External request (notifications)

### Actions/Execution

Manipulate the DOM/web page
Communicate w/ External Services
Perform calculations
Store/read data

and more...

## Chrome Extension Use Cases

Chrome Extensions are a great way to solve a problem. That does not mean that they should be used to solve all problems. Ultimately, Chrome Extensions need to have a singular, focused purpose. This isn't just my recommendation: Chrome has a ["single purpose"](https://developer.chrome.com/extensions/single_purpose) policy for Chrome Extensions. This is in place to make sure that Chrome Extensions stay simple and don't turn into a early iPhone toolbox app with lots functionality, and none of it good. That being said, I'm not actually sure how Google enforces this policy and I've seen some Chrome Extensions that certainly stretch it. For example, the AMP Readiness Tool extension I referenced earlier not only detects relevant technologies for when creating an AMP page, but it also provides code snippets to help you get started with converting your analytics. Both are related, but does that count as two separate purposes? Apparently not, since it's still up.

![A chrome extension realizing that it will never visit France](https://media.giphy.com/media/elmyDvAaEBNCv88SN1/giphy.gif)
*A Chrome extension realizing that it only speeds up HTML5 videos and will never visit France*

##### If you can't focus your use case, then that can be a good sign that you should utilize something else.

Along with a single purpose, I cannot stress enough that ease of use is a critical factor, and absolutely must be a part of the design process. Chrome Extensions should either run in the background and enhance the user experience during their user flow, or they should be invoked with a single click. Forms or anything that requires more text than would be required for a search are going to guarantee that your extension doesn't get used. If you can't get it done in a click, then maybe a web app or form is a better fit anyways. There's no reason to use Chrome Extensions where something else would accomplish the same task.

![A dog getting booped](https://media.giphy.com/media/d5T6fLw1bLDuJ3oPxZ/giphy.gif)
*A Chrome extension being activated with a single click, while another runs in the background*


## Chrome Extension Development

Chrome Extensions are basically just a web page. They are built using Javascript, and if there are any visual elements such as a popup, you'll need to work with HTML and CSS.

Chrome extensions have a few key components.

The first is the manifest file:

```json
{
  "name": "AMP Readiness Tool",
  "short_name": "AMP Readiness Tool",
  "author": "Phillip Kriegel",
  "homepage_url": "https://github.com/ampproject/ampbench/tree/master/readiness-tool",
  "description": "Identify web technologies that are relevant to AMP",
  "version": "4.0.1",
  "default_locale": "en",
  "manifest_version": 2,
  "icons": {
    "16": "images/amp-readiness-new.png",
    "48": "images/amp-readiness-new.png",
    "128": "images/amp-readiness-new.png"
  },
  "page_action": {
    "default_icon": "images/amp-readiness-new.png",
    "default_title": "AMP Readiness Tool",
    "default_popup": "html/popup.html"
  },
  "background": {
    "page": "html/background.html",
    "persistent": true
  },
}
```

It provides information about your extension, such as name, version, a description, and icons. In addition, it's where you'll declare the scripts that perform the various functions required by your script. Extension architectures will vary based on functionality.

There are two main script types.

![UI Elements diagram](/assets/posts/chrome-extensions/background_content_js.png)
*Your extension's logic is generally run through background and content scripts*

**Background Page/Script:**
These run in the background and is are never viewed in a tab. Serves as the extension event listener. It waits for the specified event (tab open, page navigation, extension click) and then executes its logic. Has highest level access to Chrome APIs. Instead of using a single script, you can use an html page to load a variety of scripts and set the page as a background page.

**Content Scripts:**
If you read or write from the web page, then you'll need a content script. These scripts can read and modify the DOM, but as such are limited to their access to Chrome APIs and execute in an isolated runtime environment.

![UI Elements diagram](/assets/posts/chrome-extensions/popup.png)
*The popup elements are responsible for rendering the UI*

Any UI Elements Are Composed of HTML, CSS, and JS.

**Popup Page/Script:**
You can use HTML, CSS, and JS to create a popup that appears on a click or another condition

**Options Page:**
When you right click on a Chrome extension, you can visit an "Options" page that can overlay the default options page or act as its own entirely

![Diagram of message passing](/assets/posts/chrome-extensions/messages.png)
*Messages being passed between scripts*

Extension scripts don't share the same namespace with each other (or with page scripts)

Communication is performed by passing messages between scripts using the runtime API. You can also use the storage API to write data to the browser

**Useful Chrome APIs:**
* **storage**: Use the chrome.storage API to store, retrieve, and track changes to user data.
* **webRequest**: Use the chrome.webRequest API to observe and analyze traffic and to intercept, block, or modify requests in-flight.
* **runtime**: Use this API to retrieve the background page, return details about the manifest, and listen for and respond to events in the app or extension life cycle.

**Debugging Tips**
Developing Chrome Extensions is a little bit tricky:
Activating the extension may require manual input, so testing can be a drag.

Extensions that are loaded from a local directory have to be reloaded by Chrome separately from the page load. You can do this in the chrome://extensions tab, or you can install [Dev Extensions Reloaded](https://chrome.google.com/webstore/detail/dev-extensions-reload/bbanndmhbmgajamonlgnjnfdbifbnbdj?hl=en), which allows you to press alt + Z (or option + Z) to automatically reload all local Chrome Extensions.

Content, popup, and background scripts each write logs to a different console because scripts are executing in multiple contexts.

* Content scripts write logs in the same context as the web page they are executing on (so utilize the normal web console)

* Background scripts write logs in a separate background instance that is accessible from the extension's options page.

![background log location](/assets/posts/chrome-extensions/background_logs.png)

* Popup scripts can be debugged by opening an inspector that is only available when the extension is invoked.

![popup log location](/assets/posts/chrome-extensions/popup_logs.png)

## Chrome Extension Distribution

A one time, $5 fee is required to verify your account if you want to publish your extension for the world to see. The Chrome Web Store is the only way to distribute extensions. That's really all I have to say about that. You can visit the Chrome Extension Developer Dashboard by clicking the gear icon in the Chrome Web Store. That's really all I have to say about that.

Hopefully you find this somewhat useful. Obviously the official documentation can get you into the nitty gritty, but some of the things I learned along the way weren't initially obvious, especially the development flow and debugging.
