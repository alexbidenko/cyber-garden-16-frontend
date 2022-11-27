importScripts('<%= options.workboxUrl %>');

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());

const {registerRoute} = workbox.routing;
const {
  NetworkFirst, StaleWhileRevalidate, CacheFirst,
} = workbox.strategies;
const {CacheableResponsePlugin} = workbox.cacheableResponse;
const {ExpirationPlugin} = workbox.expiration;

registerRoute(
  ({request}) => {
    return request.mode === 'navigate';
  },
  new NetworkFirst({
    cacheName: 'pages',
    plugins: [
      new CacheableResponsePlugin({statuses: [200]}),
    ],
  }),
);

registerRoute(
  ({request}) =>
    request.destination === 'style',
  new StaleWhileRevalidate({
    cacheName: 'styles',
    plugins: [
      new CacheableResponsePlugin({statuses: [200]}),
    ],
  }),
);

registerRoute(
  ({request}) =>
    request.destination === 'script' ||
    request.destination === 'worker',
  new StaleWhileRevalidate({
    cacheName: 'scripts',
    plugins: [
      new CacheableResponsePlugin({statuses: [200]}),
    ],
  }),
);

registerRoute(
  ({request}) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new CacheableResponsePlugin({statuses: [200]}),
      new ExpirationPlugin({maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30}),
    ],
  }),
);
