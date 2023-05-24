import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      'three/examples/jsm': 'three/examples/jsm'
    }
  }
})