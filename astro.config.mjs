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
    '/places/gb/wales-march-2025': '/places/gb-wls/anglesey-march-2025',
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