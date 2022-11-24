import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  server: {
    port: 5174
  },
  build: {
    rollupOptions : {
      input: {
        main: resolve(__dirname, 'index.html'),
        nested: resolve(__dirname, 'siteConf/index.html')
      },
      output : {
        dir: "dist"
      }
    }
  }
})
