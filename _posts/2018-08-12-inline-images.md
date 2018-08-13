---
layout: post
title: "Are Inlined Images Useful?"
excerpt: I read about something in an old book, should we still take it seriously?
keywords: Chrome, AMP, performance, code, mobile speed, JSON, HTTPS, inline images, data, URL, URI, external, inlining, webpagetest, Accelerated Mobile Pages, Phillip, Kriegel
---

I was reading an older book about web performance optimization recently, [High Performance Websites](https://smile.amazon.com/High-Performance-Web-Sites-Essential/dp/0596529309?sa-no-redirect=1) by Steve Sounders. Published in 2007, it's quite fascinating to see how much things have changed, and yet, how much has stayed the same. The book lays out about a dozen or so recommendations, most of which are still extremely relevant. Reduce HTTP requests, place CSS at the top of the page, place scripts at the bottom, set your caching headers; these are tips that I still see not being followed all over the web, and it's not like they are hard tips to follow. They're just details. A checklist (or a copy of the book) by your desk might be a good idea to try to keep these things top of mind.

But I'm not here to summarize the book. I do want to take a look at some of the more obscure techniques that I found in it, either because they aren't relevant anymore or because it's just not practical (think domain sharding in the era of HTTP/2). It's interesting to take a look at some of these things because it's interesting to think about how things were 10 years ago. Maybe they could actually come in handy.

The first thing I'd like to profile are inline images that use the data: URL scheme. In the interest of minimizing HTTP requests, it's possible to use the data: protocol to embed the image in your HTML as a string of data.

For example, the following img tag creates a little folder icon:

```html
<img src="data:image/gif;base64,R0lGODlhEAAOALMAAOazToeHh0tLS/7LZv/0jvb29t/f3//Ub/
/ge8WSLf/rhf/3kdbW1mxsbP//mf///yH5BAAAAAAALAAAAAAQAA4AAARe8L1Ekyky67QZ1hLnjM5UUde0ECwLJoExKcpp
V0aCcGCmTIHEIUEqjgaORCMxIC6e0CcguWw6aFjsVMkkIr7g77ZKPJjPZqIyd7sJAgVGoEGv2xsBxqNgYPj/gAwXEQA7"
width="16" height="14" alt="embedded folder icon">
```

This one makes a little red star:

```html
<img width="16" height="16" alt="star" src="data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7" />
```

I say little because it's important to note that this isn't a good idea for anything more complex than sprites. Some older browsers have limits on the size that is allowed.

You can also use these in stylesheets, which is probably the only way I can imagine it being useful to use nowadays. If you want to embed a number of small images, they would then be cached within the sheet. Embedding in the HTML results in a larger document that isn't getting cached. In addition, you'd have to duplicate images if you want to use them twice, unlike in CSS where you simply reference the rule again.

It's a small difference but It's certainly something to consider if you're trying to squeeze out every bit of performance. With HTTP/2, sprite sheets don't make as much sense as they used to because of multiplexing, and if your site has a limited icon set, it might make more sense to place them in your external or inline styles. 

It'd potentially be a small optimization, but one I hadn't thought about. Let's take a look at some tests. The following pages render the exact same content, but in 4 different ways. We download two smaller icon images (a folder and a red star) that are probably closer to the usual use case for this type of image. I also included a large image from a favorite film of mine, just to compare.

*   [Individual image downloads](https://www.philkrie.me/experiments/inline_images/image_download.html)
*   [Inlining in HTML](https://www.philkrie.me/experiments/inline_images/inline_html_image.html)
*   [Inlining in external CSS](https://www.philkrie.me/experiments/inline_images/external_css_image.html)
*   [Inlining in inline CSS](https://www.philkrie.me/experiments/inline_images/inline_css_image.html)

Let's take a look at some [Webpagetest](http://webpagetest.org/) charts for each page.

<amp-img width="932" height="266" layout="responsive" src="/assets/posts/inline-images/downloaded_images.png"></amp-img>
<caption>**Downloading Images as an external resource**</caption>

<amp-img width="932" height="266" layout="responsive" src="/assets/posts/inline-images/inline_html.png"></amp-img>
<caption>**Inlining in HTML**</caption>

<amp-img width="932" height="266" layout="responsive" src="/assets/posts/inline-images/inline_external_css.png"></amp-img>
<caption>**Inlining in External CSS**</caption>

<amp-img width="932" height="266" layout="responsive" src="/assets/posts/inline-images/inline_inline_css.png"></amp-img>
<caption>**Inlining in Inlined CSS**</caption>

Something that's interesting is that images aren't progressively loaded with data URLs. If you look at the top image, which is for downloading as an image, you see that the document is actually complete at about 5 seconds. Overall load time is slower vs inlining in the HTML or CSS, but the page is complete sooner. That makes sense, since inlined images won't render until the entire stylesheet is parsed, at which point all the data is already available so it appears all at once.

Externally managed CSS should be used for the reasons why we use externally CSS at all: easier management, modularity, etc. But in raw terms, having it inline CSS is better simply because you remove a request.

What these charts also show is that there is always a cost to extra HTTP requests. The best performing pages from a raw load time perspective are where we only download the single HTML document (and a favicon but that doesn't count). Between those two methods, I think it is obvious that you should use inline styles, since you can apply the same image to multiple areas without having to copy and paste and increase the size of your document.

At the same time, the inline images HTML get parsed and displayed sequentially, with the smaller images showing up before the large image. With inline or external CSS, everything appears at once since CSS is render blocking and won't display anything until all the styles are parsed.

I should probably run more tests with a large number of smaller images. From these I think a few things are obvious:
<br>
*   If you are going to use large images, this makes no sense. Progressive loading works better, so just download the image.
*   You can and maybe should use inlining for small images! You remove HTTP requests.
*   If you have duplicate images, place the images in your CSS so that you can efficiently display them multiple times without increasing page weight.
*   If you don't have duplicate images, consider inlining in the HTML so that you can have the images load in progressively.

Useful? Marginally. It's probably not worth the effort in this day and age, but who knows.
