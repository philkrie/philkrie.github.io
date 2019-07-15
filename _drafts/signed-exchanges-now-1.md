---
layout: post
title: "Investigating Signed Exchanges/Web Packaging (Using Now)"
excerpt: Let someone else serve your users for you
keywords: Signed, Exchanges, Web Packaging, zeit, code, now, development, AMP, tutorial, Phillip, Kriegel
---

##### Signed Exchanges

Signed HTTP exchanges (SXG) is a technology that enables Web Packaging. You can read a much more in depth article on this [here](https://developers.google.com/web/updates/2018/11/signed-exchanges), but the gist of it that you (the publisher) sign an HTTP exchange that gives another server (perhaps a CDN like the Google AMP Cache or Cloudflare) permission to serve the site under your domain name.

This would enable you to offload all of your site serving to a CDN that you do not own. Currently, most sites use CDNs to quickly serve static assets like fonts, styles, and images. However, under that model, the initial HTTP request is up to you to serve. For some sites, this leads to a choke point: nothing can start until the document is loaded and parsed. No matter how much you optimize the page itself, if the time to first byte is high, you have a floor that you cannot lower without investing in better serving.

With signed exchanges you can give **everything** to the CDN, without having to show the user the actual serving URL. This makes analytics, sharing, and the user experience significantly better.

##### Applications of Signed Exchanges

For example, the Google AMP Project has been continuously criticized because of the way it serves pages from the Google AMP Cache in Google Search. In order to achieve the fastest speed possible, the Google AMP Cache serves the AMP page that you create on your behalf. As a result it is served with a cache URL. The benefits are immediate: AMP pages served from the AMP cache load almost instantly. However, the downsides quickly become apparent: the page appears in an "AMP Viewer" that shows the URL of the publisher, while the browser shows that the user is still on google.com.

This can lead to confusion when a user shares the link. It also impacts analytics, since it can be hard to stitch the sessions as the user moves from google.com to the actual origin. For more attentive users, it can also cause trust issues: they just clicked a link, so why are they still on google.com?

With web packaging, the AMP Project is expecting to [solve this issue](https://blog.amp.dev/2018/05/08/a-first-look-at-using-web-packaging-to-improve-amp-urls/). Since the publisher makes the decision and grants permission to whichever cache they choose while signing it with a cryptographic signature, this is a secure, safe way to achieve this goal.

Chrome is currently the only browser that supports this, but other browsers are expected to follow suit. In addition, Digicert is the only Certificate Authority that supported SXGs for, but for the purposes of this tutorial, all certificates are self-signed.

##### Zeit Now

For this guide, I wanted to go through my process of setting up a signed exchange sample on my own in a clear, concise manner. There are guides online for how to do this, as well as several tools available to help, but I wanted to ensure that anyone reading this article could quickly see what it's all about.

During this process I elected to use (ZEIT's Now)[https://zeit.co/] service, which is a great way to quickly spin up a project, especially if you want to serve from HTTPS (which is required for SXG). If you haven't used it, it's basically a serverless platform that allows you to quickly deploy and test things out. It's kind of like [glitch](https://glitch.com/) but I think it works better simply because glitch is meant to be for simple projects. This is a simple project, but when it comes to working with files that aren't HTML, CSS, and JS, glitch just doesn't cut it. 

That's my spicy hot take though, you could probably do this entire process with glitch as well, but I didn't.

I chose to use Node with Express within my Now deployment

##### SXG Tools

I can say with 100% certainty that without this [guide](https://github.com/WICG/webpackage/tree/master/go/signedexchange#creating-our-first-signed-exchange) I wouldn't have been able to do this.

First off, it provides helper tools for generating signed exchanges. Secondly, it gives you openssl configs for generating and signing certificates. openssl has a lot of flags available for usage, so I don't think I could have figured it out without this guidance. We'll go through what each flag does during the process.

If you have a website that you want to use for the SXG, go ahead. Since this is a self-signed certificate (you'll have to launch Chrome with flags that enable you to access self-signed SXGs), you could actually use ANY URL as the "publisher URL". The "CDN" in this case will be the ZEIT Now instance, and the goal will be to serve content from the Now instance while showing the publisher's URL in the address bar. I chose my own site it exists, but you can use Google.com if you want. In a real world scenario, since you are getting a certificate from Digicert, obviously both parties would have to agree for this to be allowed.

##### The Process

Let's get into, shall we?

Here's the high level process:

1. Set up and spin up a ZEIT Now instance
1. Install signed exchange tools
1. Create an HTML file to enclose in your SXG
1. Use openssl and the SXG tools to generate the SXG
1. Place the SXG and certificate on the ZEIT Now instance
1. Navigate to the SXG and stare in awe at your URL address bar

Seems easy enough right?

###### Step 1: Set up ZEIT

You can sign up for Zeit [here](https://zeit.co/signup).

Read the [documentation](https://zeit.co/examples/express/) for Express in Now. You can take a look at my code [here](INSERT LINK HERE).

With Zeit, you configure a project as normal, but with an additional now.json file. This configures the now deployment: you can set routes, static assets, and build rules for your project.

###### Step 2: Install the signed exchange tools

The [SXG tools](https://github.com/WICG/webpackage/tree/master/go/signedexchange#creating-our-first-signed-exchange) require a Go environment, so figure that out. You can follow that guide

###### Step 3: Create an HTML file to serve

When creating an SXG, you actually enclose the HTML you are serving in the SXG. This essentially means you can put whatever you want in there. In a real world scenario you'd never do that, because you want your site to map to the correct URL no matter how it is served. But it gets to a key concept with SXGs: the original page doesn't actually matter. The SXG contains all the information required to serve the page with the publisher URL, including the content of the document itself. The publisher's server does not play a part.

The HTML enclosed in an SXG can be anything, but obviously you are incentivized to serve the correct page. I would also imagine that any platform that allows SXGs to be served on it (such as Google Search) would take measures to ensure page parity.

For example, in its current state, the HTML served from the AMP Cache is actually different from the HTML that you have hosted on your page. It gets further [optimized](https://amp.dev/documentation/guides-and-tutorials/optimize-and-measure/optimize_amp#), so technically it isn't the same page. With SXG, this would be fine.

For the purpose of illustration (and to know immediately that the SXG is working), I recommend not using your actual page HTML.

```bash
echo "<h1>This is not philkrie.me... or is it?</h1>" > sxg_payload.html
```

###### Step 4: Use openssl/SXG Tools to generate the SXG

Use openssl in your terminal to create the following files (replace philkrie.me with your preferred domain). Because I don't like invoking a command I don't know, I'll add descriptions of each flag and explain what is happening.

```bash
# Generate prime256v1 ecdsa private key.
openssl ecparam -out priv.key -name prime256v1 -genkey
```
* ecparam specifies that we want to generate a key using Elliptic Curve cryptography
* -out priv.key specifies to write out to a file called priv.key
* -name specifies the usage of a specific set of Elliptic Curve parameters, in this case known as prime256v1
* -genkey is required to actually generate an EC key. Otherwise, the output will just be EC parameters.

# Create a certificate signing request for the private key.
openssl req -new -sha256 -key priv.key -out cert.csr \
  -subj '/CN=philkrie.me/O=Test/C=US'
# Self-sign the certificate with "CanSignHttpExchanges" extension.
openssl x509 -req -days 360 -in cert.csr -signkey priv.key -out cert.pem \
  -extfile <(echo -e "1.3.6.1.4.1.11129.2.1.22 = ASN1:NULL\nsubjectAltName=DNS:philkrie.me")
```



###### Step 5: Place the SXG and certificate on the ZEIT Now instance

###### Step 6: Navigate to the SXG and stare in awe at your URL address bar

