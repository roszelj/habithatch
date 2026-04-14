// Firebase Cloud Messaging service worker for background push notifications.
// This file must be served from the root path (/firebase-messaging-sw.js).
// Vite serves /public as root, so this file is in the correct location.
//
// Note: ES module imports are not used here — service workers require importScripts.
// The Firebase client config values below are public keys and safe to hardcode.

importScripts('https://www.gstatic.com/firebasejs/12.11.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.11.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyCcgnUmLReSXKwjDKtoDdoilUFOvC4772Q',
  authDomain: 'habithatch-e0133.firebaseapp.com',
  projectId: 'habithatch-e0133',
  storageBucket: 'habithatch-e0133.firebasestorage.app',
  messagingSenderId: '448441035260',
  appId: '1:448441035260:web:2e1ff94e7dc4c1f1242a79',
});

// Initialising messaging is enough — the compat SDK registers a push handler
// that auto-displays background notifications from the `notification` field in
// the FCM payload (title, body, icon set via webpush.notification in the Cloud
// Function). No onBackgroundMessage handler is needed; adding one previously
// caused duplicate notifications because the SDK showed the notification AND
// the handler showed a second copy.
firebase.messaging();
