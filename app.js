// register service worker

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/serviceworkerdemo/sw.js', { scope: '/serviceworkerdemo/' }).then(function(reg) {
    
    if(reg.installing) {
      console.log('Service worker installing');
    } else if(reg.waiting) {
      console.log('Service worker installed');
    } else if(reg.active) {
      console.log('Service worker active');
    }
    
  }).catch(function(error) {
    // registration failed
    console.log('Registration failed with ' + error);
  });
};

// function for loading each image via XHR
function SampleAPIRequest(url) {
  return new Promise(function(resolve, reject){
    var xhttp = new XMLHttpRequest;
    xhttp.open('GET', url, true);
    xhttp.onload = function () {
      if(xhttp.status = 200) {
        resolve(JSON.parse(xhttp.response));
      } else {
        reject(xhttp.statusText);
      }
    }
    xhttp.onerror = function () {
      reject(xhttp.statusText);
    }
    xhttp.send();
  })}

SampleAPIRequest('https://api.streamable.com/videos/3sdm').then(function(response) {
  console.log('Response:' + response);
}).then(function (error) {
  console.log('Error:' + error);
})