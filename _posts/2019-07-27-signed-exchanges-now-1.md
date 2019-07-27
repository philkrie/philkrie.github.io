---
layout: post
title: "Investigating Signed Exchanges/Web Packaging (Using Now) Pt. 1"
excerpt: Let someone else serve your users for you (Overview)
keywords: Signed, Exchanges, Web Packaging, zeit, code, now, development, AMP, tutorial, Phillip, Kriegel
---

##### Signed Exchanges

Signed HTTP exchange (SXG) is a technology that enables Web Packaging. You can read a much more in depth article on this [here](https://developers.google.com/web/updates/2018/11/signed-exchanges), but the gist of it that you (the publisher) sign an HTTP exchange that gives another server (perhaps a CDN like the Google AMP Cache or Cloudflare) permission to serve the site under your domain name.

This would enable you to offload all of your serving to a server that you do not own. Currently, most sites use CDNs to quickly serve static assets like fonts, styles, and images. However, under that model, the initial HTTP request is still up to you to serve. For some sites, this leads to a choke point: nothing can start until the document is loaded and parsed. No matter how much you optimize the page itself, if the time to first byte is high, you have a floor that you cannot lower without investing in better serving.

With signed exchanges you can give **everything** to the CDN, without having to show the user the actual serving URL. This makes analytics, sharing, and the user experience significantly better.

##### Applications of Signed Exchanges

For example, the Google AMP Project has long been criticized because of the way it serves pages from the Google AMP Cache in Google Search. In order to achieve the fastest speed possible, the Google AMP Cache serves the AMP page that you create on your behalf. As a result, it is served with a cache URL. The benefits are immediate: AMP pages served from the AMP cache load almost instantly. However, the downsides quickly become apparent as well: the page appears in an "AMP Viewer" that shows the URL of the publisher, while the browser shows that the user is still on google.com.

<amp-img width="320" height="312" layout="responsive" src="/assets/posts/signed_exchanges/amp_cache_example.png"></amp-img>
<caption>*As you can see, we are viewing an SFGate page, but the small sfgate.com header is hardly enough to distract us from 'google.com'*</caption>

This can lead to confusion when a user shares the link. It also impacts analytics, since it can be hard to stitch the sessions as the user moves from google.com to the actual origin. For more attentive users, it can also cause trust issues: they just clicked a link, so why are they still on google.com?

With web packaging, the AMP Project is expecting to [solve this issue](https://blog.amp.dev/2018/05/08/a-first-look-at-using-web-packaging-to-improve-amp-urls/). Since the publisher makes the decision and grants permission to whichever cache they choose while signing it with a cryptographic signature, this is a secure, safe way to achieve this goal.

Chrome is currently the only browser that supports this, but other browsers are expected to follow suit. In addition, Digicert is the only Certificate Authority that supported SXGs for, but for the purposes of this tutorial, all certificates are self-signed.

##### Zeit Now

For this guide, I wanted to go through my process of setting up a signed exchange sample on my own in a clear, concise manner. There are guides online for how to do this, as well as several tools available to help, but I wanted to ensure that anyone reading these posts could quickly see what it's all about.

During this process I elected to use (ZEIT's Now)[https://zeit.co/] service, which is a great way to quickly spin up a project, especially if you want to serve from HTTPS (which is required for SXG). If you haven't used it, it's basically a serverless platform that allows you to quickly deploy and test things out. It's kind of like [glitch](https://glitch.com/) but I think it works better simply because glitch is meant to be simple by design. This is a simple project, but when it comes to working with files that aren't HTML, CSS, and JS, glitch just doesn't cut it.

That's my hot take though, you could probably do this entire process with glitch as well, but I didn't.

I chose to use Node with Express within my Now deployment

##### SXG Tools

I can say with 100% certainty that without this [guide](https://github.com/WICG/webpackage/tree/master/go/signedexchange#creating-our-first-signed-exchange) I wouldn't have been able to figure this out. It's the guide taht I followed for creating my example.

First off, it provides helper tools for generating signed exchanges. Secondly, it gives you openssl configs for generating and signing certificates. openssl has a lot of flags available for usage, so with a lack of experience it can be extremely confusing. We'll go through what each flag does during the process.

If you have a website that you want to use for the SXG, go ahead. Since this is a self-signed certificate (you'll have to launch Chrome with flags that enable you to access self-signed SXGs), you could actually use ANY URL as the "publisher URL". The "CDN" in this case will be the ZEIT Now instance, and the goal will be to serve content from the Now instance while showing the publisher's URL in the address bar. 

I chose my own site it exists, but you can use Google.com if you want. In a real world scenario, since you are getting a certificate from Digicert, obviously both parties would have to agree for this to be allowed. But you can maybe use this to prank someone.

That's the end of part 1. I'm going to go through the process of actually creating a self signed SXG in part 2, so stay tuned!
