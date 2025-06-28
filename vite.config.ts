import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import tailwindcss from '@tailwindcss/vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(), 
    viteStaticCopy({
      targets: [
        {
          src: 'src/autosave.js',
          dest: ''
        }
      ]
    })
  ],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'index.html'),
        content: resolve(__dirname, 'src/content.ts')
      },
      output: {
        entryFileNames: assetInfo => {
          if (assetInfo.name === "content") return "content.js";
          return "[name].js";
        }
      }
    }
  }
})
