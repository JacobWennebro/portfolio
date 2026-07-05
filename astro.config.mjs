// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import rehypeExternalLinks from 'rehype-external-links';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.wennebro.com',
  trailingSlash: 'never',
  integrations: [sitemap()],

  redirects: {
    '/places/gb/wales-march-2025': '/places/wales/anglesey-march-2025',
    '/places/gb-wls/anglesey-march-2025': '/places/wales/anglesey-march-2025',
    '/places/ma/agadir-ouarzazate-january-2026': '/places/morocco/agadir-ouarzazate-january-2026',
    '/places/mk/a-night-in-skopje-november-2025': '/places/north-macedonia/a-night-in-skopje-november-2025',
    '/places/sk/bojnice-castle-june-2026': '/places/slovakia/bojnice-castle-june-2026',
    '/places/us/seattle-wa-july-2024': '/places/united-states/seattle-wa-july-2024',
  },

  markdown: {
    rehypePlugins: [
      [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
    ],
  },

  vite: {
    plugins: [tailwindcss()]
  },

  adapter: cloudflare({
    imageService: 'compile',
  })
});