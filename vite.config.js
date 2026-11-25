import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' makes the build work at any GitHub Pages address
// (username.github.io/repo-name/ or a custom domain).
export default defineConfig({
  plugins: [react()],
  base: './',
});
