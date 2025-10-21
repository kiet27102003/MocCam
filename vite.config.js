import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Cấu hình Vite dev server proxy
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, 
    proxy: {
      '/api': {
        target: 'https://moccam-backend.onrender.com', 
        changeOrigin: true,               
        secure: false,                   
      },
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['antd', '@ant-design/icons']
        }
      }
    }
  },
  base: './'
})
