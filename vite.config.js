import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import path from 'path';



export default defineConfig({
  define: {
    'process.env': {},
    'global': {},
  },
  resolve: {
    alias: {
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      assert: 'assert',
      http: 'stream-http',
      https: 'https-browserify',
      os: 'os-browserify',
      url: 'url',
      vm: 'vm-browserify',
      path: 'path-browserify',
      zlib: 'browserify-zlib',
      constants: 'constants-browserify',
      process: 'process/browser',
      'node:url': 'url/',
      'node:path': 'path-browserify',
      'node:os': 'os-browserify',
      'node:constants': 'constants-browserify',
      'node:stream': 'stream-browserify',
      'node:util': 'util/',
      'node:assert': 'assert',
      're2': path.resolve(__dirname, 'src/re2-shim.js'),
      'koffi': path.resolve(__dirname, 'src/koffi-shim.js'),
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
        NodeModulesPolyfillPlugin()
      ]
    },
    
  },
  plugins: [
    react(),
  ],
});
