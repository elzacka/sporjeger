import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary'
import { validateEnvironment } from './utils/validateEnv'

// Validate environment variables before app starts (non-blocking in production)
try {
  validateEnvironment()
} catch (error) {
  console.error('Environment validation failed:', error)
}

// Register service worker for PWA functionality (production only)
// Disabled for iOS Safari due to compatibility issues
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  // Detect iOS Safari
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  // Skip service worker on iOS Safari to prevent reload loops
  if (isIOS && isSafari) {
    console.log('iOS Safari detected - unregistering any existing service workers');
    // Unregister any existing service workers on iOS Safari
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => {
        registration.unregister().then(() => {
          console.log('Service worker unregistered on iOS Safari');
        });
      });
    }).catch(err => {
      console.log('Failed to unregister service workers:', err);
    });
  } else {
    window.addEventListener('load', () => {
      // Use correct base path for service worker
      const swPath = import.meta.env.BASE_URL + 'sw.js';
      navigator.serviceWorker.register(swPath)
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
)
