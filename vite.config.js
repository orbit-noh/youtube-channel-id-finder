import { defineConfig } from 'vite'

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  server: {
    allowedHosts: ['.trycloudflare.com'],
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
})
