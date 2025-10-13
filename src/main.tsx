import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Simple, working version - no service worker for now
createRoot(document.getElementById('root')!).render(<App />)
