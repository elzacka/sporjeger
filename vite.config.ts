import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/sporjeger/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14', 'ios14'],
    cssTarget: ['chrome87', 'safari14', 'ios14'],
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom']
        }
      }
    }
  },
  server: {
    port: 5173,
    host: true
  }
})
