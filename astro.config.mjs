import markdoc from "@astrojs/markdoc";
import mdx from "@astrojs/mdx";
import node from "@astrojs/node";
import partytown from "@astrojs/partytown";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import keystatic from "@keystatic/astro";
import expressiveCode from "astro-expressive-code";
import icon from "astro-icon";
import lighthouse from "astro-lighthouse";
import robotsTxt from "astro-robots-txt";
import { defineConfig } from "astro/config";
import simpleStackForm from "simple-stack-form";

// https://astro.build/config
export default defineConfig({
  site: "https://v3frankie.me",
  markdown: {},
  image: {
    domains: ["images.unsplash.com"],
  },
  prefetch: true,
  integrations: [
    tailwind(),
    sitemap(),
    robotsTxt(),
    partytown(),
    expressiveCode(),
    mdx(),
    markdoc(),
    keystatic(),
    icon(),
    lighthouse(),
    react(),
    simpleStackForm(),
  ],
  output: "hybrid",
  adapter: node({
    mode: "standalone",
  }),
  // Cloudflare D1 platform proxy and use Astro's Image service with passthrough mode
  // adapter: cloudflare({
  //   platformProxy: true,
  //   imageService: "passthrough"
  // }),
  vite: {
    build: {
      rollupOptions: {
        output: {
          entryFileNames: "entry.[hash].mjs",
          chunkFileNames: "chunks/chunk.[hash].mjs",
          assetFileNames: "assets/asset.[hash][extname]",
        },
      },
    },
    plugins: [],
  },
});
