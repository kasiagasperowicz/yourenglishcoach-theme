import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,

    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/js/main.js'),
      },

      output: {
        entryFileNames: 'js/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
});