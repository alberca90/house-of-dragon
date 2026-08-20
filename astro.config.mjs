import { defineConfig } from 'astro/config';
import keystatic from '@keystatic/astro';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),     // <--- Añadir esta integración
    keystatic(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});