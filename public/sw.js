const cacheName = 'v1'

const cacheAssets = [
    'index.html',
    'video.html',
    'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.2/css/bootstrap.min.css'
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
self.addEventListener('fetch', event => {
    event.respondWith(
     fetch(event.request).then(res => {
        const resClone = res.clone();

        caches.open(cacheName)
        .then(cache => {
            cache.put(event.request, resClone);
        });

        return res;
     }).catch(err => caches.match(event.request).then(res => res))
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

  
  
  
  

 



