import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // Preserve original filenames for fonts and handle other assets
          if (assetInfo.name?.match(/\.(woff|woff2|eot|ttf|otf)$/)) {
            return 'assets/[name][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        }
      }
    }
  },
  // Ensure proper handling of static assets
  assetsInclude: ['**/*.woff', '**/*.woff2']
})