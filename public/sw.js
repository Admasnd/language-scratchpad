// The version of the cache - UPDATE THIS when you deploy changes
const VERSION = "v1";

// The name of the cache (versioned)
const CACHE_NAME = `langpad-${VERSION}`;

// Static resources to cache
const APP_STATIC_RESOURCES = [
    "/",
    "/index.html",
    "/style.css",
    "/app.js",
    // Add all your static assets here
];

// Install event - precache static resources
// Install event also occurs with updates when service worker is changed
self.addEventListener("install", (event) => {
    // waitUntil ensures worker is not terminated until resources are cached
    event.waitUntil(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            await cache.addAll(APP_STATIC_RESOURCES);
        })()
    );
});

// Activate event - clean up old caches
// Happens after install event
self.addEventListener("activate", (event) => {
    event.waitUntil(
        (async () => {
            const names = await caches.keys();
            await Promise.all(
                names.map((name) => {
                    if (name !== CACHE_NAME) {
                        return caches.delete(name);
                    }
                    return undefined;
                })
            );
            await clients.claim();
        })()
    );
});

// Fetch event - serve cached content offline
self.addEventListener("fetch", (event) => {
    // override browser default for fetching
    event.respondWith(
        // Call async function so we return a Promise that resolves to a Response
        (async () => {
            // If online, fetch from network; otherwise, fetch from cache
            try {
                const networkResponse = await fetch(event.request);
                if (networkResponse.ok) {
                    // Cache the response for future use
                    cache.put(event.request, networkResponse.clone());
                }
                return networkResponse;
            } catch (error) {
                const cache = await caches.open(CACHE_NAME);
                const cachedResponse = await cache.match(event.request.url);
                if (cachedResponse) {
                    return cachedResponse;
                }
                else {
                    // Return 404 if offline and not cached
                    return new Response(null, { status: 404 });
                }
            }
        })()
    );
});
