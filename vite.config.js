import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    global: 'window',
    },
  base: "/goit-js-hw-11/",
  root: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  },
});