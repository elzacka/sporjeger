import { createRoot } from 'react-dom/client'
import { preconnect, prefetchDNS, preload } from 'react-dom'
import { Suspense } from 'react'
import './index.css'
import App from './App.tsx'
import { DataErrorBoundary } from './components/DataErrorBoundary'
import { SkeletonLoader } from './components/SkeletonLoader'
import { validateEnvironment } from './utils/validateEnv'
import { initPerformanceMonitoring, markPerformance } from './utils/performance'

// iOS 26.0.x WebKit Bug #297779 Workaround
// Detects iOS 26.0.x and applies CSS class for alternative layout
const detectIOS26 = () => {
  const userAgent = navigator.userAgent
  const isIOS26 = /iPhone OS 26_0/.test(userAgent)

  if (isIOS26) {
    console.warn('iOS 26.0.x detected - applying fixed positioning workaround')
    document.documentElement.classList.add('ios26-workaround')
    // Add to body when it becomes available
    if (document.body) {
      document.body.classList.add('ios26-workaround')
    } else {
      // If body doesn't exist yet, add it when DOM is ready
      document.addEventListener('DOMContentLoaded', () => {
        document.body.classList.add('ios26-workaround')
      })
    }
  }

  return isIOS26
}

// Apply iOS 26 detection immediately
detectIOS26()

// Initialize performance monitoring
initPerformanceMonitoring()
markPerformance('app-init-start')

// Global error handler for iOS debugging with visual feedback
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error, event.message, event.filename, event.lineno)

  // Show visual error on screen for iOS debugging
  const root = document.getElementById('root')
  if (root && !root.innerHTML) {
    root.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; padding: 2rem; background: #0a0e0a; color: #00ff41; font-family: monospace;">
        <h1 style="font-size: 1.5rem; margin-bottom: 1rem;">⚠️ JavaScript Error</h1>
        <p style="margin-bottom: 0.5rem;"><strong>Message:</strong> ${event.message}</p>
        <p style="margin-bottom: 0.5rem;"><strong>File:</strong> ${event.filename}</p>
        <p style="margin-bottom: 0.5rem;"><strong>Line:</strong> ${event.lineno}</p>
        <p style="margin-top: 1rem; opacity: 0.7;">Check Safari Web Inspector for details</p>
      </div>
    `
  }
})

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason)
})

// Validate environment variables before starting app
try {
  validateEnvironment()
} catch (error) {
  console.error('Environment validation failed:', error)
  // Continue anyway - errors will show in DataErrorBoundary
}

// React 19.2: Optimize resource loading
preconnect('https://sheets.googleapis.com')
preconnect('https://fonts.googleapis.com')
preconnect('https://fonts.gstatic.com', { crossOrigin: 'anonymous' })
prefetchDNS('https://sheets.googleapis.com')

// Preload critical fonts
preload('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200', { as: 'style' })
preload('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;500;600;700;800;900&display=swap', { as: 'style' })

// React 19: Enhanced error handling
try {
  const rootElement = document.getElementById('root')

  if (!rootElement) {
    throw new Error('Root element not found')
  }

  createRoot(rootElement, {
    onCaughtError: (error, errorInfo) => {
      console.error('React caught error:', error, errorInfo)
    },
    onUncaughtError: (error, errorInfo) => {
      console.error('React uncaught error:', error, errorInfo)
    },
    onRecoverableError: (error, errorInfo) => {
      console.warn('React recoverable error:', error, errorInfo)
    }
  }).render(
    // React 19: Suspense + ErrorBoundary for data fetching
    <DataErrorBoundary>
      <Suspense fallback={<SkeletonLoader />}>
        <App />
      </Suspense>
    </DataErrorBoundary>
  )
} catch (error) {
  console.error('Failed to initialize React app:', error)

  // Show visual error if React fails to initialize
  const root = document.getElementById('root')
  if (root) {
    root.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; padding: 2rem; background: #0a0e0a; color: #00ff41; font-family: monospace; text-align: center;">
        <h1 style="font-size: 1.5rem; margin-bottom: 1rem;">⚠️ Failed to Initialize App</h1>
        <p style="margin-bottom: 1rem;">Error: ${error instanceof Error ? error.message : String(error)}</p>
        <p style="opacity: 0.7; font-size: 0.875rem;">Check Safari Web Inspector console for details</p>
        <button onclick="location.reload()" style="margin-top: 2rem; padding: 0.75rem 1.5rem; background: #00ff41; color: #0a0e0a; border: none; border-radius: 4px; font-family: monospace; cursor: pointer;">
          Reload Page
        </button>
      </div>
    `
  }
}

// Register Service Worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sporjeger/sw.js')
      .then((registration) => {
        console.log('[SW] Service Worker registered:', registration.scope)

        // Check for updates periodically
        setInterval(() => {
          registration.update()
        }, 60 * 60 * 1000) // Check every hour

        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New version available
                console.log('[SW] New version available! Please refresh.')
                // Could show a toast notification here
              }
            })
          }
        })
      })
      .catch((error) => {
        console.error('[SW] Service Worker registration failed:', error)
      })
  })
}
