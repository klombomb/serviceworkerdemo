TK Add links to documentation
TK highlight keywords
### Offline Web Apps made easy 

In this tutorial I will be teaching you how to make your web app/site/thing offline ready. 
Although support for the features I'll be using in this article aren't fully supported yet they soon will be 
(hopefully).
The goal of this article is to make the building of an offline web app as simple as possible. Till now the learning curve has been quite steep but I want to change that. 
The core components of offline web applications are Service Workers. A Service Worker is a standalone piece of JavaScript that doesn't run within but rather alongside your other JS.
Another difference with normal JavaScript files is that Service Workers can't access things like the DOM. Their main purpose is to interact with the network.

A Service Worker is basically a proxy in between the client and 
your web server. A Service Worker can intercept network requests and, if there is a Cache available, return those files instead of the ones on your server. Of course a Service Worker can do
 a lot more but as I said before, I'm trying to keep things simple. 

Before we can start using Service Workers we need to know one thing that is at the core of nearly every new  Web API, Promises. 
Promises are a fundamental new part of the JavaScript language. A Promise doesn't differentiate that much from a real life promise. 
If you keep your promise one thing happens and if you don't something else does. Just like in real life, you can also promise things in the future. This makes a
Promises ideal for asynchronous JavaScript. 

### Promises in Practice

One of the most common places to use asynchronous JavaScript is within an AJAX request. Below you can find a piece of code the demonstrates the use of a 
Promise within an Ajax request.
```javascript
window.onload = function () {
  function SampleAPIRequest(url) {
    return new Promise(function (resolve, reject) {
      var xhttp = new XMLHttpRequest;
      xhttp.open('GET', url, true);
      xhttp.onload = function () {
        if (xhttp.status = 200) {
          resolve(JSON.parse(xhttp.response));
        } else {
          reject(xhttp.statusText);
        }
      }
      xhttp.onerror = function () {
        reject(xhttp.statusText);
      }
      xhttp.send();
    })
  }
  console.log('Window Loaded');
  SampleAPIRequest('https://api.streamable.com/videos/3sdm').then(function (response) {
    console.log('Response:');
    console.dir(response);
  }).catch(function (error) {
    console.log('Error:' + error);
  })
}
```
As you can see, Promises provide a far cleaner syntax than you would otherwise have. The `SampleAPIRequest` function itself is a Promise which can Resolve (positive) and Reject (negative).
Resolve returns its 'payload' to the `.then` we chain to `SampleAPIRequest`. Reject returns its payload to the `.catch` chained to the `.then`. To learn more about Promises, head over
 to [MDN](https://developer.mozilla.org/nl/docs/Web/JavaScript/Reference/Global_Objects/Promise). 
 
### Creating your first Service Worker. 

Before you create your first Service Worker you need to know 5 more things. 

1. Service Workers aren't fully supported yet so you have to check if they are, otherwise you are executing unknown code.
2. A Service Worker has too be contained within the same origin (scope) as the other files it will be working with. That means they need to be in the same directory. 
3. Service Workers need their own files. You can't just add one to your main JavaScript code since the syntax is slightly different. (For example: `this` in normal DOM JavaScript refers to the Window object, in a Service Worker `this` refers to the Worker itself).
4. A Service Worker can't be added using a Script tag. A Service Worker needs to be registered within a normal JavaScript file.  
5. Service Workers need to be served from a Secure Connection over https. 

The code below can go into your typical `main.js` file. 
```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/serviceworkerdemo/sw.js', { scope: '/serviceworkerdemo/' }).then(function (reg) {

    if (reg.installing) {
      console.log('Service worker installing');
    } else if (reg.waiting) {
      console.log('Service worker installed');
    } else if (reg.active) {
      console.log('Service worker active');
    }

  }).catch(function (error) {
    // registration failed
    console.log('Registration failed with ' + error);
  });
};
```

Although I've already given you the code for registering your Service Worker we'll have to actually make one aswell(otherwise we can't register anything, right?).
As I said before, the Service Worker runs in a separate thread. The Worker itself emits events, and can react to them. Best practice is to name the file `sw.js`. 
The first event we'll be reacting to is the `install` event. 
```javascript
this.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        '/serviceworkerdemo/',
        '/serviceworkerdemo/index.html',
        '/serviceworkerdemo/style.css',
        '/serviceworkerdemo/app.js',
      ]);
    })
  );
});
```
In this snippet of we're caching the core files of our website, also known as our Appshell. This includes the core JavaScript, CSS and HTML, but not any externally loaded data. 
The main caching code is wrapped in a `event.waitUntill()' function. This makes sure that the Service Worker doesn't fire its waiting event (installed) before you've cached your files.

Our Service Worker has now been installed but it won't do anything yet. In a nutshell a Service Worker has three different states. 
1. Installing
2. Installed 
3. Active

The state you will find a Service Worker in most often is the active state. The next time someone visits your website the Service Worker will intercept the request. We then have to 
check if the file the user is requesting is in the cache. The code for that is below. We are reacting to the `fetch` event. 

```javascript
this.addEventListener('fetch', function(event) {
  console.log('Handling fetch event for', event.request.url);

  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        console.log('Found response in cache:', response);

        return response;
      }
      console.log('No response found in cache. About to fetch from network...');

      return fetch(event.request).then(function(response) {
        console.log('Response from network is:', response);

        return response;
      }).catch(function(error) {
        console.error('Fetching failed:', error);

        throw error;
      });
    })
  );
});
```

First we check if the requested file is in the cache, if so we return it. If that is not the case we go ahead and let the network do what is usually does (fetch the file from the server).
And in worst case scenario if there isn't a network available or a cache we return an error, also causing a network error. 

### Continuing your journey with Service Workers

This is just a very basic introduction to Service Workers and offline web apps. Should wish to continue on this path I encourage you to do some more extensive reading on MDN.

Looking for some inspiration?

Service Workers make things possible that were previously not possible on the web. For example you could: 

- Create a video player the caches the next couple of minutes of a video that makes it possible for the user to keep watching a video even if they are offline for a little while. 
- Create a weather app that works offline because you can cache a 5 day weather forecast. 