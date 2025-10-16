import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Vite 7.1.10 + React 19.2 + iOS 26 Optimized Configuration
export default defineConfig({
  plugins: [
    react({
      // React 19.2: Enable automatic JSX runtime
      jsxRuntime: 'automatic',
      // React 19.2: Babel plugins for better optimization
      babel: {
        plugins: [
          // Add babel plugins if needed for iOS compatibility
        ],
      },
    }),
  ],
  base: '/sporjeger/',

  // Configure esbuild for dev server to target iOS 26 Safari compatibility
  esbuild: {
    target: 'es2019',
    // Disable features not well-supported in iOS Safari
    supported: {
      'top-level-await': false,
    },
    // iOS Safari: Preserve function names for better debugging
    keepNames: true,
  },

  // Optimize dependency pre-bundling for iOS
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2019',
    },
    // Force pre-bundle these for better iOS performance
    include: ['react', 'react-dom'],
  },

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Enable sourcemaps for better debugging in production
    sourcemap: true,
    // iOS Safari compatibility: es2019 target
    target: ['es2019', 'safari14', 'ios14'],
    cssTarget: ['safari14', 'ios14'],
    // Optimize chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Separate React into its own chunk
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
          // Lazy-loaded components get their own chunks automatically
          // This includes CommandPalette, Menu, InstallPrompt
          if (id.includes('src/components/CommandPalette')) {
            return 'command-palette';
          }
          if (id.includes('src/components/Menu') ||
              id.includes('src/components/GuideModal') ||
              id.includes('src/components/FilterModal')) {
            return 'menu-modals';
          }
          if (id.includes('src/components/InstallPrompt')) {
            return 'install-prompt';
          }
          // Group all other node_modules into a vendor chunk
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        // Better asset naming for caching
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) return `assets/[name]-[hash][extname]`
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`
          } else if (/woff|woff2/.test(ext)) {
            return `assets/fonts/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
    // Vite 7.1: Better minification
    minify: 'esbuild',
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },

  server: {
    port: 5173,
    host: true,
    // Better HMR for mobile development
    hmr: {
      overlay: true,
    },
    // CORS for mobile testing
    cors: true,
  },

  // Vite 7.1: Preview server configuration
  preview: {
    port: 4173,
    host: true,
  },
})
