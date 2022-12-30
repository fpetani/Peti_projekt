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
self.addEventListener('fetch', e=>{
    console.log('Service worker: Fetching')

    e.respondWith(
        fetch(e.request).catch(()=> caches.match(e.request))
    )
})

 



