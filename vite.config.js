import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    // Exclude large media files from the file watcher — prevents EBUSY
    // crashes when mp4/webp files are copied in while dev server is running.
    watch: {
      ignored: ['**/public/assets/**', '**/public/*.mp4', '**/public/*.webp'],
    },
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react':  ['react', 'react-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-gsap':   ['gsap'],
          'vendor-three':  ['three'],
          'vendor-lucide': ['lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
