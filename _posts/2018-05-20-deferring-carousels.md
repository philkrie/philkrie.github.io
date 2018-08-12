---
layout: post
title: "Deferring Images in Auto-Scrolling Carousels"
excerpt: Deferring images in auto-scrolling carousels defers only your hopes and dreams
keywords: carousels, deferring, images, lazy-loading, UX design, UX, mobile, performance
---

<amp-img width="1024" height="768" layout="responsive" src="/assets/posts/deferred-carousels/playground-carousel.jpg"></amp-img>
<caption>*I have fond memories of this kind of carousel. Others, not so much*</caption>

#### TL;DR: Things are only lazy loaded if the user initiates the load. If the image is going to get loaded eventually, regardless of user input, then you haven't deferred it. You've simply increased your page load.

Carousels are a fact of life on the mobile web. From retailers to publishers and everything in between, there's a significant chance that if you visit a site on your phone, there will be a carousel waiting for you at the top of the page, ready to show you not one, not two, not three, but perhaps four different promos.

The sins of carousels are well documented: just type ["are carousels bad?"](http://shouldiuseacarousel.com/) into Google and you'll get hundreds of blog posts screaming that yes they absolutely are and you'd have to be absolutely daft to use one.

I heartily agree. Carousels __*can*__ be useful in certain scenarios, such as for product browsing. They should absolutely never be used at the top of your landing or home page. It makes much more sense from a performance perspective to show a single image hero banner instead of loading multiple images that a user may not see. From a conversion perspective, it makes more sense to show the user the single most relevant offer or image based on what you know about them. Burying the most relevant advertisement in a carousel all but ensures that [they won't see it](https://erikrunyon.com/2013/07/carousel-interaction-stats/).

Of course, carousels have a very important feature: political mediation. Some developers, knowing full well that carousels aren't effective, are forced to add them anyways so that everyone can have their turn to show off their new creative. Everyone wants to be on the front page, but you can't add *everyone's* content to the front page so you shove it in a carousel, wipe your hands, and let it go. Your users will suffer, but hey, at least Jess has her promo on slide 7.

This blog post is for those developers. I don't have to convince you that [carousels are bad](https://medium.com/envato/design-debate-are-image-carousels-ux-assets-or-liabilities-3b10f2fe221f). You already know that. But, if your situation is futile and you can't get rid of them no matter how much you protest, at the very least you should make what you have as optimal as it can be.

Something that I do notice on many sites that I review are lazy loaded images in carousels. Lazy loading or deferring images until they are visible is an optimization that you should have for every visible element on your page. Don't load something unless the user is going to see it.

However, sometimes these deferred images are present on auto-scrolling carousels. Applying said "optimization" in this case can be a grave mistake: it only increases your page load and time to visual completeness, as measured by tools such as [WebPagetest](http://webpagetest.org/) and [Lighthouse](https://developers.google.com/web/tools/lighthouse/).

[But you don't have to take my word for it](https://i0.wp.com/badbooksgoodtimes.com/wp-content/uploads/2017/02/but-you-dont-have-to-take-my-word-for-it.gif). Here are four sample carousels that I whipped up that go through four scenarios: [manual carousel](https://www.philkrie.me/experiments/carousels/carousel.html), [auto-scrolling carousel](https://www.philkrie.me/experiments/carousels/auto-carousel.html), [manual carousel with lazy loading](https://www.philkrie.me/experiments/carousels/carousel-lazy.html), and [auto-scrolling carousel with lazy loading](https://www.philkrie.me/experiments/carousels/auto-carousel-lazy.html). The auto-scrolling carousels change images every 3 seconds.

Each of these sites were tested on WebPagetest on a slow 3G connection (400 Kbps/400ms RTT). The waterfalls are shown below.

<amp-img width="938" height="562" layout="responsive" src="/assets/posts/deferred-carousels/manual-waterfall.png"></amp-img>
<caption>*Manual Carousel*</caption>

<amp-img width="938" height="562" layout="responsive" src="/assets/posts/deferred-carousels/auto-waterfall.png"></amp-img>
<caption>*Auto-Scrolling Carousel*</caption>

<amp-img width="938" height="562" layout="responsive" src="/assets/posts/deferred-carousels/manual-lazy-waterfall.png"></amp-img>
<caption>*Manual Lazy-Loading Carousel*</caption>

<amp-img width="938" height="562" layout="responsive" src="/assets/posts/deferred-carousels/auto-lazy-waterfall.png"></amp-img>
<caption>*Auto-Scrolling Lazy-Loading Carousel*</caption>

The chart below contains the results.

<amp-img width="600" height="371" layout="responsive" src="/assets/posts/deferred-carousels/chart.png"></amp-img>
<caption>*A chart comparing carousel load times*</caption>


As you can see, the results are pretty stark. Document complete time for the lazy loaded carousels is lower than their non-deferred counterparts: this makes sense as the initial load only has to bring in one image, instead of several. However, perhaps unsurprisingly, the auto lazy carousel takes almost 30 seconds to become visually complete according to WebPagetest. Before the page can "settle" and be complete visually, the page changes.

In light of the upcoming update to Google Search that designates mobile speed as a [ranking factor](https://webmasters.googleblog.com/2018/01/using-page-speed-in-mobile-search.html), it would be best to ensure that your site load isn't artificially lengthened by preventing your page from coming to a visual resting point. If you can't remove your carousel, then at the very least do this.

Here is the bottom line: things are only lazy loaded if the user initiates the load. If the image is going to get loaded eventually, regardless of user input, then you haven't deferred it. You've simply increased the amount of time your page takes to fully load.

Perhaps its obvious to some, but I've seen it enough that hopefully this helps someone.
