import { createRoot } from 'react-dom/client'
import { preconnect, prefetchDNS, preload } from 'react-dom'
import { Suspense } from 'react'
import './index.css'
import App from './App.tsx'
import { DataErrorBoundary } from './components/DataErrorBoundary'
import { SkeletonLoader } from './components/SkeletonLoader'
import { validateEnvironment } from './utils/validateEnv'

// Global error handler for iOS debugging
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error, event.message, event.filename, event.lineno)
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
createRoot(document.getElementById('root')!, {
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
