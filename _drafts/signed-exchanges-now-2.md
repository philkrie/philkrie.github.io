---
layout: post
title: "Investigating Signed Exchanges/Web Packaging (Using Now) Pt. 2"
excerpt: Let someone else serve your users for you (Investigation)
keywords: Signed, Exchanges, Web Packaging, zeit, code, now, development, AMP, tutorial, Phillip, Kriegel
---

This is a two parter because it started to get really long. This part covers my process of going through the signed exchange set up with a self signed certificate [guide](https://github.com/WICG/webpackage/tree/master/go/signedexchange) and [ZEIT Now](https://zeit.co/now).

Please read [part 1](https://www.philkrie.me/TODO) for my overview of signed exchanges and Zeit Now.

##### The Process

Here's the high level process:

1. Set up and spin up a ZEIT Now instance
1. Install signed exchange tools
1. Create an HTML file to enclose in your SXG
1. Use openssl and the SXG tools to generate the SXG
1. Place the SXG and certificate on the ZEIT Now instance
1. Navigate to the SXG and stare in awe at your URL address bar

###### Step 1: Set up ZEIT

You can sign up for Zeit [here](https://zeit.co/signup).

Read the [documentation](https://zeit.co/examples/express/) for Express in Now. You can take a look at my code [here](INSERT LINK HERE).

With Zeit, you configure a project as normal, but with an additional now.json file. This configures the now deployment: you can set routes, static assets, and build rules for your project.

###### Step 2: Install the signed exchange tools

The [SXG tools](https://github.com/WICG/webpackage/tree/master/go/signedexchange#creating-our-first-signed-exchange) require a Go environment, so figure that out. You can follow the guide

###### Step 3: Create an HTML file to serve

When creating an SXG, you actually enclose the HTML you are serving in the SXG. This essentially means you can put whatever you want in there. In a real world scenario you'd never do that, because you want your site to map to the correct URL no matter how it is served. But it gets to a key concept with SXGs: the original page doesn't actually matter. The SXG contains all the information required to serve the page with the publisher URL, including the content of the document itself. The publisher's server does not play a part.

The HTML enclosed in an SXG can be anything, but obviously you are incentivized to serve the correct page. 

I would also imagine that any platform that allows SXGs to be served on it (such as Google Search) would eventually take measures to ensure page parity.

For example, in its current state, the HTML served from the AMP Cache is actually different from the HTML that you have hosted on your page. It gets further [optimized](https://amp.dev/documentation/guides-and-tutorials/optimize-and-measure/optimize_amp#), so technically it isn't the same page (though it looks the same). With SXG, this would be fine.

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

```bash
# Create a certificate signing request for the private key.
openssl req -new -sha256 -key priv.key -out cert.csr -subj '/CN=philkrie.me/O=Test/C=US'
```
* req specifies that we are creating a signing request
* -new simply indicates that this is a new request
* -sha256 is the hash digest we want to sign with
* -key specifies the key we want to use (in this case generated in the last step)
* -out lets us name our certificate signing request (.csr) file
* -subj specifies the subject of the request. In this case, we specify the Common Name (CN) of our server, the Organization (O) name (which is just Test here), and Country (C). You can read more [here](https://www.globalsign.com/en/blog/what-is-a-certificate-signing-request-csr/), there's a lot more you could add.

```bash
# Self-sign the certificate with "CanSignHttpExchanges" extension.
openssl x509 -req -days 360 -in cert.csr -signkey priv.key -out cert.pem \
  -extfile <(echo -e "1.3.6.1.4.1.11129.2.1.22 = ASN1:NULL\nsubjectAltName=DNS:philkrie.me")
```



###### Step 5: Place the SXG and certificate on the ZEIT Now instance

###### Step 6: Navigate to the SXG and stare in awe at your URL address bar

