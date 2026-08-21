import { defineConfig } from 'astro/config';
import keystatic from '@keystatic/astro';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  adapter: vercel(),
  integrations: [
    react(),     // <--- Añadir esta integración
    keystatic(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});