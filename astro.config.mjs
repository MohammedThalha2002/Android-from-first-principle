import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
  // Canonical URLs and the sitemap are generated from this. A placeholder
  // here ships a sitemap full of unreachable URLs, so it is read from the
  // deploy environment and only falls back for local development.
  site: process.env.SITE_URL ?? 'http://localhost:4321',
  output: 'static',
  integrations: [
    mdx(),
    sitemap(),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
    rehypePlugins: [],
  },
});
