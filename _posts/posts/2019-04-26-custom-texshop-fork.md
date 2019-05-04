---
layout: default
title:  "Custom TeXShop Fork"
date:   2019-04-26 10:30:00 +1100
permalink: tex/custom-texshop-fork
category: post
tags:
  - tex
  - objective-c
  - macos
color: 3D6117
comments: true
---

## Custom TeXShop Fork

<small style="color: #777; top: -10px; position: relative">
  Written by <a href="https://github.com/lukakerr">Luka Kerr</a> on April 26, 2019
</small>

A couple of weeks ago I [forked TeXShop](https://github.com/lukakerr/TeXShop) and made a few minor modifications
to make the app look and feel more modern.

Some of the changes include:

- Adding an inline toolbar
- Adding a transparent titlebar
- Making the source/preview separator thinner
- Adding the ability to change the background of the preview view
- Remove small \~1px line from top of source editor

I like apps on my mac to look and feel modern, keeping up to date with the latest macOS design trends, especially
apps that I use almost daily.

Below is a screenshot of before and after:

![1]({{ "/assets/img/tex/TeXShop-before.png" | absolute_url }})

> Before

![2]({{ "/assets/img/tex/TeXShop-after.png" | absolute_url }})

> After

If you're keen on using my custom fork, head over to [lukakerr/TeXShop](https://github.com/lukakerr/TeXShop),
open the project in Xcode, compile it and archive it into a `.app`.