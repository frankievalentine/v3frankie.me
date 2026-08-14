// @ts-check

import mdx from "@astrojs/mdx";
import partytown from "@astrojs/partytown";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import expressiveCode from "astro-expressive-code";
import pagefind from "astro-pagefind";

/** @type {import('vite').Plugin} */
const pagefindExternalPlugin = {
	name: "pagefind-external",
	enforce: "pre",
	// Mark /pagefind/pagefind.js as external at Vite's resolution layer so neither
	// the dev server nor the production build tries to bundle it. The file is
	// generated post-build by pagefind and served at runtime.
	resolveId(id) {
		if (id === "/pagefind/pagefind.js") {
			return { id, external: true };
		}
	},
};

// https://astro.build/config
export default defineConfig({
	site: "https://v3frankie.me",
	integrations: [
		pagefind(),
		expressiveCode({
			themes: ["catppuccin-mocha", "catppuccin-latte"],
			useDarkModeMediaQuery: false,
			themeCssSelector: (theme) =>
				theme.type === "dark" ? ".dark" : ":root:not(.dark)",
		}),
		mdx(),
		react(),
		sitemap(),
		partytown({
			config: {
				debug: true,
				forward: ["dataLayer.push"],
				logScriptExecution: true,
				logSendBeaconRequests: true,
				resolveSendBeaconRequestParameters(url) {
					if (url.hostname === "analytics.v3frankie.net") {
						return { keepalive: false };
					}
				},
			},
		}),
	],
	output: "static",
	vite: {
		plugins: [tailwindcss(), pagefindExternalPlugin],
		optimizeDeps: {
			// Prebundle the client-only modules that are loaded on first navigation so
			// Vite does not invalidate .vite/deps while Astro's dev toolbar is still
			// resolving its own dynamic imports.
			include: [
				"astro/virtual-modules/transitions.js",
				"astro/virtual-modules/transitions-router.js",
				"astro/virtual-modules/transitions-types.js",
				"astro/virtual-modules/transitions-events.js",
				"astro/virtual-modules/transitions-swap-functions.js",
				"basecoat-css/all",
			],
		},
	},
});
