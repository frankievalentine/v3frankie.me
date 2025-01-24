import markdoc from "@astrojs/markdoc";
import mdx from "@astrojs/mdx";
// import node from "@astrojs/node";
import cloudflare from "@astrojs/cloudflare";
import partytown from "@astrojs/partytown";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import keystatic from "@keystatic/astro";
import tailwindcss from '@tailwindcss/vite';
import expressiveCode from "astro-expressive-code";
import icon from "astro-icon";
import robotsTxt from "astro-robots-txt";
import { defineConfig } from "astro/config";
import simpleStackForm from "simple-stack-form";

// https://astro.build/config
export default defineConfig({
  site: "https://v3frankie.me",
  markdown: {},
  image: {
    domains: ["images.unsplash.com"]
  },
  prefetch: true,
  integrations: [sitemap(), robotsTxt(), partytown(), expressiveCode({
      themes: ['catppuccin-mocha', 'catppuccin-latte'],
    }), mdx(), markdoc(), ...(process.env.SKIP_KEYSTATIC ? [] : [keystatic()]), react(), simpleStackForm(), icon()],
  output: "static",
  // adapter: node({
  //   mode: "standalone"
  // }),
  // Cloudflare D1 platform proxy and use Astro's Image service with passthrough mode
  adapter: cloudflare({
    platformProxy: true,
    imageService: "passthrough"
  }),
  vite: {
    resolve: {
      // Use react-dom/server.edge instead of react-dom/server.browser for React 19.
      // Without this, MessageChannel from node:worker_threads needs to be polyfilled.
      alias: import.meta.env.PROD && {
        "react-dom/server": "react-dom/server.edge",
      },
    },
    plugins: [tailwindcss()],
  },
});
