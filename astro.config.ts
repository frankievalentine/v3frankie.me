import { defineConfig } from "astro/config"
import fs from "fs"
import mdx from "@astrojs/mdx"
import tailwind from "@astrojs/tailwind"
import sitemap from "@astrojs/sitemap"
import prefetch from "@astrojs/prefetch"
import cloudflare from "@astrojs/cloudflare"
import db from "@astrojs/db"
import react from "@astrojs/react"
import markdoc from "@astrojs/markdoc"
import keystatic from "@keystatic/astro"
import icon from "astro-icon"

// https://astro.build/config
export default defineConfig({
  site: "https://v3frankie.me/",
  markdown: {
    remarkPlugins: [],
    remarkRehype: {
      footnoteLabelProperties: {
        className: [""],
      },
    },
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      wrap: true,
    },
  },
  integrations: [
    mdx({}),
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap(),
    prefetch(),
    db(),
    react(),
    markdoc(),
    keystatic(),
    icon(),
  ],
  output: "server",
  adapter: cloudflare({
    imageService: "cloudflare",
  }),
  vite: {
    plugins: [rawFonts([".ttf"])],
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
})
function rawFonts(ext: Array<string>) {
  return {
    name: "vite-plugin-raw-fonts",
    // @ts-ignore:next-line
    transform(_, id) {
      if (ext.some((e) => id.endsWith(e))) {
        const buffer = fs.readFileSync(id)
        return {
          code: `export default ${JSON.stringify(buffer)}`,
          map: null,
        }
      }
    },
  }
}
