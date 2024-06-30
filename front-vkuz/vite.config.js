import { resolve } from 'path'

export default ({
  root: resolve(__dirname, 'front'),
  build: {
    outDir: '../dist'
  },
  server: {
    host: '0.0.0.0',
    port: 3000
  }
})
