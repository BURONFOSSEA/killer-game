// sw.js

const CACHE_NAME = 'killer-game-cache-v2';
// Les fichiers essentiels de votre application à mettre en cache
const urlsToCache = [
  './',
  'index.html',
  'player-login.html',
  'player-dashboard.html',
  'supabaseClient.js',
  'manifest.json',
  'icon_192.png',
  'icon-512.png',
  'style.css'
  // Ajoutez ici d'autres fichiers importants (CSS, autres pages HTML...)
];

// Étape 1: Installation du Service Worker et mise en cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache ouvert');
        return cache.addAll(urlsToCache);
      })
  );
});

// Étape 2: Servir les fichiers depuis le cache (pour le hors-ligne)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si la ressource est dans le cache, on la sert
        if (response) {
          return response;
        }
        // Sinon, on essaie de la récupérer sur le réseau
        return fetch(event.request);
      })
  );
});

// Étape 3: Gérer les notifications push (VOTRE ANCIEN CODE)
self.addEventListener('push', event => {
  const data = event.data.json();

  const title = data.title || 'Killer Game';
  const options = {
    body: data.body || 'Vous avez une nouvelle notification.',
    icon: 'icon_192.png',
    badge: 'icon_192.png'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
