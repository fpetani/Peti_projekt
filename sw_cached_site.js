const cacheName = 'v2'

const cacheAssets = [
    'index.html',
    'video.html'
]

//call install event
self.addEventListener('install', (e)=>{
    console.log('Service worker installed')
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
        fetch(e.request)
        .then(res => {
            //Make copy clone of repsonse
            const resClone = res.clone()
            //open cache
            caches.open(cacheName)
            .then(cache=>{
                //add response to cache
                cache.put(e.request, resClone)
            })

            return res
        }).catch(err => {
            caches.match(e.request).then(res =>res)
        })
    )


})

