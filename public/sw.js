const cacheName = 'v1'

const cacheAssets = [
    'index.html',
    'video.html'
]

//call install event
self.addEventListener('install', (e)=>{
    console.log('Service worker installed')

    e.waitUntil(
        caches.open(cacheName)
        .then(cache => {
            console.log('Service Worker: cacheing files')
            cache.addAll(cacheAssets)
        })
        .then(() => self.skipWaiting())
    )
})


//activate event
self.addEventListener('activate', (e)=>{
    console.log('Service worker activate')
    //reomve unwanted caches

    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if((cache !== cacheName)){
                        console.log('Service worker clearing old cache')
                        return caches.delete(cache)
                    }
                })
            )
        })
    )
}) 

//Call fetch event
self.addEventListener('fetch', function(event) {
    event.respondWith(
      // Try to get the response from the cache
      caches.match(event.request).then(function(response) {
        // If the response is found in the cache, return it
        
        if (response) {
          return response;
        }
  
        // Otherwise, fetch the resource from the network and add it to the cache
        return fetch(event.request).then(function(response) {
          caches.open(cacheName).then(function(cache) {
            cache.put(event.request, response.clone());
          });
          return response;
        });
      })
    );
  });

  self.addEventListener("push", e => {
    const data = e.data.json();
    console.log("Push Recieved...");
    self.registration.showNotification(data.title, {
      body: "Notified by Peti projekt!",
      icon: "images/image.png"
    });
  });
  
  

 



