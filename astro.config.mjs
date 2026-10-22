// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import rehypeExternalLinks from 'rehype-external-links';

import cloudflare from '@astrojs/cloudflare';
import { readdirSync } from 'node:fs';
import { join, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const archiveRoot = fileURLToPath(new URL('./public/archive', import.meta.url));
const archiveModuleId = 'virtual:archive-filesystem';
const resolvedArchiveModuleId = `\0${archiveModuleId}`;

/**
 * @typedef {{ name: string; type: 'file' } | { name: string; type: 'directory'; children: ArchiveNode[] }} ArchiveNode
 */
/**
 * @param {string} directory
 * @returns {ArchiveNode[]}
 */
function readArchiveDirectory(directory) {
  return readdirSync(directory, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((entry) => {
      if (entry.isDirectory()) {
        return {
          name: entry.name,
          type: /** @type {'directory'} */ ('directory'),
          children: readArchiveDirectory(join(directory, entry.name)),
        };
      }

      return {
        name: entry.name,
        type: /** @type {'file'} */ ('file'),
      };
    });
}

/** @returns {import('vite').Plugin} */
function archiveFilesystemPlugin() {
  return {
    name: 'archive-filesystem',
    /** @param {string} id */
    resolveId(id) {
      return id === archiveModuleId ? resolvedArchiveModuleId : undefined;
    },
    /** @param {string} id */
    load(id) {
      if (id === resolvedArchiveModuleId) {
        return `export default ${JSON.stringify(readArchiveDirectory(archiveRoot))};`;
      }
    },
    configureServer(server) {
      server.watcher.add(archiveRoot);
      server.watcher.on('all', (_event, changedPath) => {
        if (!changedPath.startsWith(`${archiveRoot}${sep}`)) return;

        const module = server.moduleGraph.getModuleById(resolvedArchiveModuleId);
        if (module) server.moduleGraph.invalidateModule(module);
        server.ws.send({ type: 'full-reload' });
      });
    },
  };
}

/**
 * Rewrites markdown links to `#email` into the same obfuscated markup as EmailField,
 * so posts can link to the email without it appearing in the HTML.
 */
function rehypeEmailLinks() {
  /** @param {any} node */
  const walk = (node) => {
    if (!node.children) return;
    node.children = node.children.map((child) => {
      if (child.type === 'element' && child.tagName === 'a' && child.properties?.href === '#email') {
        return {
          type: 'element',
          tagName: 'span',
          properties: { className: ['relative'] },
          children: [
            {
              type: 'element',
              tagName: 'a',
              properties: { href: 'mailto:hello@bot.notmyactualemail.com', ariaHidden: 'true', tabIndex: -1, className: ['absolute', 'inset-0', 'pointer-events-none'] },
              children: [],
            },
            { ...child, properties: { href: '#', className: ['c-link'] } },
          ],
        };
      }
      walk(child);
      return child;
    });
  };
  return walk;
}

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
      rehypeEmailLinks,
      [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
    ],
  },

  vite: {
    plugins: [archiveFilesystemPlugin(), tailwindcss()],
    server: {
      allowedHosts: ['.ngrok-free.app']
    }
  },

  adapter: cloudflare({
    imageService: 'compile',
  })
});
