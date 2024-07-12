import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import alias from '@rollup/plugin-alias'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

const projectRootDir = resolve(__dirname)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [nodePolyfills(), alias(), react()],
  resolve: {
    alias: {
      '@': resolve(projectRootDir, 'src'),
    },
  },
})
