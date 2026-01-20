// sw.js
self.addEventListener('push', event => {
  const data = event.data.json(); // On récupère les données envoyées (titre, message...)

  const title = data.title || 'Killer Game';
  const options = {
    body: data.body || 'Vous avez une nouvelle notification.',
    icon: '/images/icon-192x192.png', // Optionnel : ajoute une icône dans un dossier /images
    badge: '/images/badge-72x72.png' // Optionnel : une icône plus petite
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
