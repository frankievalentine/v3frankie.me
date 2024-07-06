import { defineConfig } from "astro/config"
import tailwind from "@astrojs/tailwind"
import partytown from "@astrojs/partytown"
import react from "@astrojs/react"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import node from "@astrojs/node"
import keystatic from "@keystatic/astro"
import markdoc from "@astrojs/markdoc"
import icon from "astro-icon"
import robotsTxt from "astro-robots-txt"
import lighthouse from "astro-lighthouse"
import expressiveCode from "astro-expressive-code"

import cloudflare from "@astrojs/cloudflare"

// https://astro.build/config
export default defineConfig({
  site: "https://v3frankie.me",
  markdown: {},
  prefetch: true,
  integrations: [
    tailwind(),
    partytown(),
    react(),
    mdx(),
    sitemap(),
    markdoc(),
    keystatic(),
    icon(),
    robotsTxt(),
    lighthouse(),
    expressiveCode(),
  ],
  output: "hybrid",
  adapter: cloudflare({ platformProxy: true }),
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
})
