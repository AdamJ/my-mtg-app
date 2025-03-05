import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './assets/mana.css'
import App from './App.jsx'

console.log('API_URL:', import.meta.env.VITE_API_URL);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/public/service-worker.js', { scope: '/my-mtg-app/' })  // Path to your SW file
      .then(registration => {
        console.log('Service Worker registered:', registration);

        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // New update is available
                  console.log('New update available!');

                  // Notify the user (using your preferred method)
                  showUpdateNotification(registration);

                } else {
                  // Initial install
                  console.log('Content is cached for offline use.');
                }
              }
            };
          }
        };

      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

function showUpdateNotification(registration) {
  // 1. Using a simple alert (for demonstration)
  // if (window.confirm("A new version is available. Refresh to get the latest features?")) {
  //   registration.waiting.postMessage('SKIP_WAITING'); // Activate immediately
  //   window.location.reload(); // Refresh the page
  // }

  // 2. Or a more user-friendly notification UI (recommended)
  const notification = document.createElement('div');
  notification.className = 'update-notification';
  notification.innerHTML = `
    <p>A new version is available. Refresh to get the latest features!</p>
    <button id="refreshButton">Refresh</button>
  `;
  document.body.appendChild(notification);

  const refreshButton = document.getElementById('refreshButton');
  refreshButton.addEventListener('click', () => {
        registration.waiting.postMessage('SKIP_WAITING'); // Activate immediately
        window.location.reload(); // Refresh the page
    });

}

// const request = indexedDB.open('myDataBase', 1); // Version 1

// request.onsuccess = event => {
//   // const db = event.target.result;
//   // ... use the db object to store/retrieve data
// };

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
