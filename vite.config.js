import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import alias from '@rollup/plugin-alias'

const projectRootDir = resolve(__dirname)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [alias(), react()],
  resolve: {
    alias: {
      '@': resolve(projectRootDir, 'src'),
    },
  },
})
