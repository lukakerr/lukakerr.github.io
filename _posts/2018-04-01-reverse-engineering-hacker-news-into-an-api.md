---
layout: default
title:  "'Reverse Engineering' Hacker News Into An API"
date:   2018-04-01 17:15:00 +1100
permalink: javascript/reverse-engineering-hacker-news-into-an-api
category: javascript
tags: 
  - javascript
  - react native
  - hacker news
  - reverse engineering
color: F1E05A
comments: true
---

# 'Reverse Engineering' Hacker News Into An API

<small style="color: #777; top: -10px; position: relative">
  Written by <a href="https://github.com/lukakerr">Luka Kerr</a> on April 1, 2018
</small>

While building [hackd](https://github.com/lukakerr/hackd) I faced a problem - the official Hacker News API doesn't allow for interaction, such as upvoting, posting and commenting. I wanted hackd to be a full featured Hacker News client, so this wasn't going to cut it.

Since these actions are most likely just POST request to the Hacker News server, I decided to inspect the network requests when performing different actions - logging in, upvoting, logging out. It wasn't too hard to figure out how the requests were made and what information was needed and being passed around.

Take logging in as an example. The Hacker News login page is quite simple, you enter your username and password and click 'login'. Looking at the network request that take place, we can see that three parameters are needed: `goto`, `acct` and `pw`. 

![1]({{ "/assets/img/javascript/login.jpg" | absolute_url }})

Replicating this for other actions reveals a similar setup of passing parameters, and making a POST request. Writing a function for this should be easy enough, and thats what I did for every action I could think of. Again, lets take the login action as an example. In the snippet below, we define a function `login` that takes a `username` and `password` and makes a request to `https://news.ycombinator.com/login`. A boolean is returned of whether the response contains `Bad Login` (the error message Hacker News displays).

```javascript
/**
 * Login a user
 * @param  {String} username The users username
 * @param  {String} password The users password
 * @return {Promise}         Returns a promise that
 *                           resolves true if logged in, else false
 */
const login = (username, password) => {
  const headers = new Headers({
    'Content-Type': 'application/x-www-form-urlencoded',
    'Access-Control-Allow-Origin': '*',
  });
  
  // config.base = https://news.ycombinator.com
  return fetch(`${config.base}/login`, {
    method: 'POST',
    headers,
    body: `acct=${username}&pw=${password}&goto=news`,
    mode: 'no-cors',
    credentials: 'include',
  })
    .then(response => response.text())
    .then(responseText => {
      // Return whether logged in
      return responseText.match(/Bad Login/i);
    });
};

export {
  login,
}
```

Some actions, such as upvoting and commenting rely on a special URL containing an `auth` parameter, which can be found in the HTML of the post/comment being upvoted or commented on. An example of this is below:

```html
<a id="up_16724962" onclick="return vote(event, this, &quot;up&quot;)" href="vote?id=16724962&amp;how=up&amp;auth=4356e982da9ab9ae4f443ee80b7ede2d716834be&amp;goto=item%3Fid%3D16724962">
  <div class="votearrow" title="upvote"></div>
</a>
```

In this case, we can parse the HTML of the page and find this `href` based on the `id` of the post being upvoted or commented on, and make a request to that URL. This is implemented below using [cheerio](https://github.com/oyyd/cheerio-without-node-native) for HTML parsing:

```javascript
import cheerio from 'cheerio-without-node-native';

/**
 * Get the URL needed to upvote
 * @param  {String} itemId The item ID to upvote
 * @return {Promise}       Returns a promise that
 *                         resolves with the upvote URL
 */
const getUpvoteUrl = itemId =>
  fetch(`${config.base}/item?id=${itemId}`, {
    mode: 'no-cors',
    credentials: 'include',
  })
    .then(response => response.text())
    .then(responseText => {
      const document = cheerio.load(responseText);
      return document(`#up_${itemId}`).attr('href');
    });

/**
 * Upvote an item
 * @param  {String} itemId The item ID to upvote
 * @return {Promise}       Returns a promise that
 *                         resolves true if upvoted, else false
 */
const upvote = itemId =>
  getUpvoteUrl(itemId)
    .then(upvoteUrl =>
      fetch(`${config.base}/${upvoteUrl}`, {
        mode: 'no-cors',
        credentials: 'include',
      }),
    )
    .then(response => response.text())
    .then(responseText => true)
    .catch(error => false);

export {
  upvote,
}
```

Again, this method can be repeated for commenting, unvoting and logging out, where the unique URL is needed.

You can find a fully functional implementation for these actions in the [hackd repository](https://github.com/lukakerr/hackd/blob/master/app/helpers/api.js). 