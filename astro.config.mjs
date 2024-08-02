import { defineConfig } from "astro/config"
import tailwind from "@astrojs/tailwind"
import partytown from "@astrojs/partytown"
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
import react from "@astrojs/react"
import playformCompress from "@playform/compress"
import devtoolBreakpoints from "astro-devtool-breakpoints"

// https://astro.build/config
export default defineConfig({
  site: "https://v3frankie.me",
  markdown: {},
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
    devtoolBreakpoints(),
    (await import("@playform/compress")).default({
      CSS: {
        lightningcss: {
          // Removes too much
          unusedSymbols: false,
        },
      },
      HTML: {
        "html-minifier-terser": {
          removeAttributeQuotes: false,
        },
      },
      Image: false,
      JavaScript: true,
      SVG: true,
      Logger: 1,
    }),
  ],
  // Hybrid needed for Keystatic
  output: "hybrid",
  // Cloudflare D1 platform proxy and use Astro's Image service with passthrough mode
  adapter: cloudflare({
    platformProxy: true,
    imageService: "passthrough",
  }),
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
