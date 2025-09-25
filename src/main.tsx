@@ .. @@
 import { StrictMode } from 'react'
 import { createRoot } from 'react-dom/client'
 import { BrowserRouter } from 'react-router-dom'
 import './index.css'
 import App from './App.tsx'
 
 createRoot(document.getElementById('root')!).render(
   <StrictMode>
     <BrowserRouter>
       <App />
     </BrowserRouter>
   </StrictMode>,
 )
 
+// Register service worker for PWA functionality
 if ('serviceWorker' in navigator) {
   window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
+    navigator.serviceWorker.register('./service-worker.js')
+      .then((registration) => {
        console.log('Service Worker registered successfully:', registration.scope)
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('New content available, please refresh.')
              }
            })
          }
        })
+      })
+      .catch((registrationError) => {
        console.error('Service Worker registration failed:', registrationError)
+      })
   })
} else {
  console.log('Service Worker not supported')
 }