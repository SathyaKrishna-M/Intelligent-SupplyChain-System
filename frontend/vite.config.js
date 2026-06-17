import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // process.env.VERCEL is true when deployed on Vercel
  // Otherwise, fallback to '/SupplyChain/' for GitHub Pages
  base: process.env.VERCEL ? '/' : '/SupplyChain/',
})
