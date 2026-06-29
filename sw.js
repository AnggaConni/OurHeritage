const VERSION = 'v3';
const STATIC_CACHE = `heritage-static-${VERSION}`;
const API_CACHE = `heritage-api-${VERSION}`;
const IMAGE_CACHE = `heritage-image-${VERSION}`;

// Daftar aset inti untuk App Shell (Network First)
const CORE_ASSETS = [
    '/OurHeritage/',
    '/OurHeritage/index.html',
    '/OurHeritage/manifest.json'
];

// 1. INSTALL EVENT
self.addEventListener('install', (event) => {
    console.log('[SW v3] Installing Service Worker...');
    event.waitUntil(
        caches.open(STATIC_CACHE).then((cache) => {
            return cache.addAll(CORE_ASSETS);
        })
    );
    self.skipWaiting();
});

// 2. ACTIVATE EVENT - Hapus Cache v1/v2 yang lama
self.addEventListener('activate', (event) => {
    console.log('[SW v3] Activating & Cleaning old caches...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (!cache.includes(VERSION)) {
                        console.log(`[SW v3] Deleting old cache: ${cache}`);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// 3. FETCH EVENT - Router Strategi 4 Lapis
self.addEventListener('fetch', (event) => {
    // Abaikan request selain GET (seperti POST, PUT)
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);
    const request = event.request;

    // STRATEGI 2: API -> Network First + Cache (Fallback)
    if (url.hostname.includes('open-meteo.com') || 
        url.hostname.includes('usgs.gov') || 
        url.hostname.includes('nasa.gov')) {
        event.respondWith(networkFirst(request, API_CACHE));
        return;
    }

    // STRATEGI 4: Images, Icons, Fonts -> Cache First (Fallback Network)
    if (request.destination === 'image' || request.destination === 'font' || 
        url.pathname.endsWith('.png') || url.pathname.endsWith('.jpg') || url.pathname.endsWith('.woff2')) {
        event.respondWith(cacheFirst(request, IMAGE_CACHE));
        return;
    }

    // STRATEGI 3: JS & CSS -> Stale While Revalidate
    if (request.destination === 'script' || request.destination === 'style' || 
        url.pathname.endsWith('.js') || url.pathname.endsWith('.css')) {
        event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
        return;
    }

    // STRATEGI 1: HTML & Navigasi Lainnya -> Network First (Fallback Cache)
    if (request.destination === 'document' || request.mode === 'navigate') {
        event.respondWith(networkFirst(request, STATIC_CACHE));
        return;
    }

    // Default Fallback
    event.respondWith(networkFirst(request, STATIC_CACHE));
});


/* =========================================================
   HELPER FUNCTIONS: 3 Strategi Caching (Inti Mesin SW)
   ========================================================= */

// Strategi A: Network First (Coba download dulu. Kalau offline, pakai Cache)
async function networkFirst(request, cacheName) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone()); // Simpan diam-diam
        }
        return networkResponse;
    } catch (error) {
        console.log(`[SW v3] Network failed for ${request.url}, serving from ${cacheName}`);
        const cachedResponse = await caches.match(request);
        return cachedResponse || Promise.reject('No-match');
    }
}

// Strategi B: Cache First (Cek memori dulu. Kalau tidak ada, baru download)
async function cacheFirst(request, cacheName) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse; // Langsung tampil!
    }
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.log(`[SW v3] Offline and no cache for image/font: ${request.url}`);
    }
}

// Strategi C: Stale-While-Revalidate (Tampil instan dari cache, download update di belakang layar)
async function staleWhileRevalidate(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    // Lakukan fetch di background untuk update cache
    const networkFetch = fetch(request).then((networkResponse) => {
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    }).catch(() => {
        console.log(`[SW v3] Offline, couldn't revalidate: ${request.url}`);
    });

    // Kembalikan cache langsung (jika ada), kalau kosong tunggu hasil download
    return cachedResponse || networkFetch;
}
