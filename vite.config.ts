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
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/main.tsx'),
      name: 'MyLib',
      // the proper extensions will be added
      fileName: 'my-lib'
    },
    rollupOptions : {
      // input: {
      //   main: resolve(__dirname, 'index.html'),
      //   nested: resolve(__dirname, 'siteConf/index.html')
      // },
      output : {
        dir: "dist"
      }
    }
  }
})
