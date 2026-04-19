import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({

  plugins: [
    react(),
    tailwindcss(),
  ],
   server: {
    proxy: {
      "/api": {
        target: "https://escapable-exterior-tableware.ngrok-free.dev",
        changeOrigin: true,
        secure: true,
      },
    },
  },

})