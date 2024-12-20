import markdoc from "@astrojs/markdoc";
import mdx from "@astrojs/mdx";
// import node from "@astrojs/node";
import cloudflare from "@astrojs/cloudflare";
import partytown from "@astrojs/partytown";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import keystatic from "@keystatic/astro";
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
    }), mdx(), markdoc(), ...(process.env.SKIP_KEYSTATIC ? [] : [keystatic()]), react(), simpleStackForm(), tailwind(), icon()],
  output: "static",
  // adapter: node({
  //   mode: "standalone"
  // }),
  // Cloudflare D1 platform proxy and use Astro's Image service with passthrough mode
  adapter: cloudflare({
    platformProxy: true,
    imageService: "passthrough"
  }),
  plugins: []
});
