import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      'three/examples/jsm': 'three/examples/jsm'
    }
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_debugger: true  // This option removes debugger statements
      }
    }
  }
})
