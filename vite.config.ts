import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'index.html'),
        content: resolve(__dirname, 'src/content.ts'),
        autosave: resolve(__dirname, 'src/autosave.ts')
      },
      output: {
        entryFileNames: assetInfo => {
          if (assetInfo.name === "content") return "content.js";
          if (assetInfo.name === "autosave") return "autosave.js";
          return "[name].js";
        }
      }
    }
  }
})
