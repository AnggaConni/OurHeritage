const CACHE_NAME = 'heritage-ews-v2';

// Daftar aset inti yang akan disimpan ke memori HP/Desktop (Cache)
const ASSETS_TO_CACHE = [
    '/OurHeritage/',
    '/OurHeritage/index.html',
    '/OurHeritage/manifest.json',
    '/OurHeritage/screenshot.jpg',
    '/OurHeritage/192.png',  // <-- Tambahkan ini
    '/OurHeritage/512.png'   // <-- Tambahkan ini
];

// 1. INSTALL EVENT - Menyimpan aset inti ke Cache saat pertama kali dibuka
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Caching App Shell');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting(); // Langsung aktif tanpa menunggu tab ditutup
});

// 2. ACTIVATE EVENT - Menghapus Cache lama jika ada versi aplikasi baru
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('[Service Worker] Deleting old cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// 3. FETCH EVENT - Mengatur cara aplikasi meminta data
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // DYNAMIC DATA (API): Lewati cache, HARUS minta langsung ke internet agar EWS selalu real-time
    if (url.hostname.includes('open-meteo.com') || url.hostname.includes('usgs.gov')) {
        return; // Biarkan browser mengambil dari jaringan (Network Only)
    }

    // STATIC ASSETS: Cek Cache dulu, kalau tidak ada baru donwload dari internet (Cache First)
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Kembalikan dari cache jika ada
            if (cachedResponse) {
                return cachedResponse;
            }

            // Jika tidak ada di cache, ambil dari jaringan
            return fetch(event.request).then((networkResponse) => {
                // Simpan hasil download baru ke dalam cache untuk request berikutnya
                if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            }).catch(() => {
                // Opsional: Apa yang terjadi jika offline dan tidak ada di cache
                console.log('[Service Worker] Offline & No Cache Found');
            });
        })
    );
});
