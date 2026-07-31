// Importa bibliotecas do Firebase Messaging para o Service Worker
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

const CACHE_NAME = 'adorascale-cache-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './icon-192.jpg'
];

// Instalação do Cache Offline
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

// Ativação e limpeza de caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
});

// Interceptação de requisições para suporte offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});

// Configuração do Firebase Messaging no Service Worker
firebase.initializeApp({
  apiKey: "AIzaSyC6aTAQin74yqPDl6Q54uT42RvPamuFXMM",
  authDomain: "adorascale.firebaseapp.com",
  projectId: "adorascale",
  storageBucket: "adorascale.firebasestorage.app",
  messagingSenderId: "717015706908",
  appId: "1:717015706908:web:aa2e944ee990580b791ed9"
});

const messaging = firebase.messaging();

// Manipulador de notificações PUSH em segundo plano
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title || 'AdoraScale Update';
  const notificationOptions = {
    body: payload.notification.body || 'Você possui uma nova atualização na escala.',
    icon: './icon-192.jpg',
    badge: './icon-192.jpg'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
