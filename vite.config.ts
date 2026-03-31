import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

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
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/auth': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/certificate': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/admin/topics': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/admin/items': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/admin/learning-items': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/admin/questions': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/admin/users': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/admin/stats': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    }
  }
})
