import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Get API target from environment or use localhost
const API_TARGET = process.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: '0.0.0.0',
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'unbeneficially-undenoted-jannie.ngrok-free.dev'
    ],
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
    proxy: {
      '/learning': {
        target: API_TARGET,
        changeOrigin: true,
      },
      '/api': {
        target: API_TARGET,
        changeOrigin: true,
      },
      '/auth': {
        target: API_TARGET,
        changeOrigin: true,
      },
      '/certificate': {
        target: API_TARGET,
        changeOrigin: true,
      },
      '/admin/topics': {
        target: API_TARGET,
        changeOrigin: true,
      },
      '/admin/items': {
        target: API_TARGET,
        changeOrigin: true,
      },
      '/admin/learning-items': {
        target: API_TARGET,
        changeOrigin: true,
      },
      '/admin/questions': {
        target: API_TARGET,
        changeOrigin: true,
      },
      '/admin/users': {
        target: API_TARGET,
        changeOrigin: true,
      },
      '/admin/stats': {
        target: API_TARGET,
        changeOrigin: true,
      },
    }
  }
})
