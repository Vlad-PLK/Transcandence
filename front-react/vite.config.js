import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Production optimizations
  build: {
    // Output directory
    outDir: 'dist',
    
    // Enable source maps for debugging (set to false for production if not needed)
    sourcemap: false,
    
    // Minification - esbuild is faster and included by default
    minify: 'esbuild',
    
    // Chunk size warnings
    chunkSizeWarningLimit: 500,
    
    // Rollup options for better code splitting
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core React libraries
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
          
          // React Router
          if (id.includes('node_modules/react-router-dom')) {
            return 'router';
          }
          
          // Three.js - large library, separate chunk
          if (id.includes('node_modules/three')) {
            return 'three';
          }
          
          // Bootstrap and UI libraries
          if (id.includes('node_modules/bootstrap') || 
              id.includes('node_modules/react-bootstrap') ||
              id.includes('node_modules/@popperjs')) {
            return 'ui-vendor';
          }
          
          // i18n libraries
          if (id.includes('node_modules/i18next') || 
              id.includes('node_modules/react-i18next')) {
            return 'i18n';
          }
          
          // Other node_modules
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        
        // Asset file names
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(assetInfo.name)) {
            return `assets/images/[name]-[hash][extname]`;
          } else if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        
        // Chunk file names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        
        // Entry file names
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
    
    // Target modern browsers for smaller output
    target: 'es2015',
    
    // CSS code splitting
    cssCodeSplit: true,
    
    // Increase chunk size limit before warning
    reportCompressedSize: true,
  },
  
  // Server configuration for development
  server: {
    port: 3000,
    host: true,
    strictPort: true,
  },
  
  // Preview configuration
  preview: {
    port: 3000,
    host: true,
    strictPort: true,
  },
})