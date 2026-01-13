import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import { nodePolyfills } from 'vite-plugin-node-polyfills'

import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    wasm(),
    topLevelAwait(),
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    })
  ],
  resolve: {
    alias: {
      'fs/promises': path.resolve(__dirname, 'src/shims/empty.js'),
      'fs': path.resolve(__dirname, 'src/shims/empty.js'),
    }
  },
  server: {
    // Relaxed headers to allow browser extension (MetaMask) injection
    // headers: {
    //   "Cross-Origin-Opener-Policy": "same-origin",
    //   "Cross-Origin-Embedder-Policy": "require-corp",
    // },
    fs: {
      allow: ['..']
    },
    proxy: {
      '/ollama': {
        target: 'http://localhost:11434',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ollama/, '')
      }
    }
  },
  optimizeDeps: {
    include: ['keccak', 'secp256k1', 'sha3'],
    exclude: [],
    esbuildOptions: {
      target: 'esnext',
      define: {
        global: 'globalThis',
      },
    }
  },
  build: {
    target: 'esnext'
  }
})
