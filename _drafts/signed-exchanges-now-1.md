---
layout: post
title: "Investigating Signed Exchanges/Web Packaging (Using Now)"
excerpt: Let someone else serve your users for you
keywords: Signed, Exchanges, Web Packaging, zeit, code, now, development, AMP, tutorial, Phillip, Kriegel
---

Signed HTTP exchanges (SXG) is a technology that enables Web Packaging. You can read a much more in depth article on this [here](https://developers.google.com/web/updates/2018/11/signed-exchanges) but the gist of it that you (the publisher) sign an HTTP exchange that gives another server (the most common use case would be a CDN like the Google AMP Cache or Cloudflare) permission to serve the site under your domain name. 

This would enable you to offload the entireity of your site serving to a CDN that you do not own. Currently, most sites use CDNs to quickly serve static assets like fonts, styles, and images. However, under that model, the initial HTTP request is up to you to serve. For some sites, this leads to a chokepoint: nothing can start until the document is loaded and parsed, so no matter how much you optimize the page itself, if that time to first byte is slow, you have a high speed floor.

With signed exchange you can give **everything** to the CDN, without having to show the user the actual serving URL. This makes analytics, sharing, and the user experience signficantly better.

For example, one way in with the Google AMP Project has been continuously critiqued is through the way it serves pages from the Google AMP Cache in Google Search.

In order to achieve the fastest speed possible, the Google AMP Cache serves the AMP page that you create on your behalf. That means it is served with a cache URL. The benefits are immediate: AMP pages served from the AMP cache load almost instantly. However, the downsides quickly become apparent as well: the page appears in an "AMP Viewer" that shows the URL of the publisher, while the browser shows that the user is still on google.com. This leads to confusion when sharing as well as analytics, since it can be hard to stitch the sessions as the user moves from google.com to the actual origin. For more attentive users, it can also cause trust issues: they just clicked a link, so why are they still on google.com? Is this a scam or an error? Its completely understandable.

With web packaging, the AMP URL issue promises to [get solved](https://blog.amp.dev/2018/05/08/a-first-look-at-using-web-packaging-to-improve-amp-urls/). Since the publisher makes the decision and grants permission to the caches they choose, and since it is signed with a cryptographic signature, this is a secure, safe way to achieve this goal.

Chrome is currently the only browser that supports this, but other browsers are expected to follow suit.

Currently Digicert is the only Certificate Authority that supported SXGs, but for the purposes of this tutorial, all certificates are self-signed.

Zeit Now
With ALL that being said, let's get into, shall we?

For this guide, I wanted to go through my process of setting up a signed exchange sample on my own in a clear, concise manner. There are guides online for how to do this, as well as several tools available, but I wanted to ensure that anyone who wanted to could come here and quickly see what its all about.

During this process I elected to use (ZEIT's Now)[https://zeit.co/] service, which is a great way to quickly spin up a project, especially if you want to serve from HTTPS (which is required for SXG). If you haven't used it, it's basically a serverless platform that allows you to quickly deploy and test things out. It's kind of like [glitch](https://glitch.com/) but I think it works better simply because glitch is meant to be for simple projects. This is a simple project, but when it comes to working with files that aren't HTML, CSS, and JS, it just doesn't cut it. That's my spicy hot take though, you could probably do this entire process with glitch as well, but I didn't.

I chose to use Node x Express within my now deployment, which is just what I'm more comfortable with.

SXG Tools
I can say with 100% certainty that without this [guide](https://github.com/WICG/webpackage/tree/master/go/signedexchange#creating-our-first-signed-exchange) I wouldn't have been able to do this. It 1. provides helper tools for generating signed exchanges and 2. gives you openssl configs for generating and signing certificates. Each command has so many flags, so I don't think I could have figured it out without this guidance. We'll go through what each flag does during the process. 

If you have a website that you want to use for the SXG, go ahead. Since this is a self-signed certificate (you'll have to launch Chrome with flags that enable you to acccess self-signed SXGs), you could actually use ANY URL as the "publisher URL". The "CDN" in this case will be the ZEIT Now instance, and the goal will be to serve content from the Now instance while showing the publisher's URL in the address bar. I chose my own site because I have a blog, but you can use Google.com if you want. In a real world scenario, since you ware getting a certificate from Digicert, obviously both parties would have to agree for this to be allowed.

High level process:
Set up and spin up a ZEIT Now instance
Install signed exchange tools
Create an HTML file to enclose in your signed exchange
Use openssl and the SXG tools to generate our certificate and SXG
Place the SXG and certificate on the ZEIT Now instance
Navigate to the SXG and stare in awe at your URL address bar

Seems easy enough right?

Guide:
ZEIT Now Set Up:
You can take a look at my code [here](INSERT LINK HERE). I used express, which allows me to control the headers of any requests. This allows us to set the headers for the SXG and CBOR certificate. 


The [SXG tools](https://github.com/WICG/webpackage/tree/master/go/signedexchange#creating-our-first-signed-exchange) require a Go environment, so figure that out. You can follow that guide
