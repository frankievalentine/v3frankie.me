# Project Guide

## Stack

- Astro 7 static site, managed with Bun 1.3.14.
- Tailwind CSS 4 and Basecoat provide styling and UI primitives.
- React and React Flow power the homelab canvas.
- Cloudflare Pages hosts production.

## Source Layout

- `src/pages/` contains routes.
- `src/content/` contains Markdown and MDX content collections.
- `src/components/` contains shared Astro and React components.
- `src/layouts/` contains page layouts.
- `src/styles/` contains global styles.
- `public/` contains static assets.

## Validation

Run the narrowest relevant check first:

- `bun run typecheck`
- `bunx biome lint <path>`
- `bun run build`

`bun run check` currently reports diagnostics in generated
`worker-configuration.d.ts`; do not edit that generated file to resolve them.

## Deployment

Production is Cloudflare Pages project `v3frankie-me`.

- `bun run cfdeploy` builds the site and publishes `dist/client` to Pages.
- Do not replace it with `wrangler deploy`: that targets a Worker, while this
  project has no production Worker. Doing so can leave HTML and hashed assets
  out of sync.
- Preserve static Cloudflare Pages hosting unless a migration is explicitly
  approved.

## Content and Local Files

- Keep Astro content collection schemas on `astro/zod`; Astro requires it.
- The newsletter's browser-side form validation uses Valibot.
- `.agents/` is a local ignored workspace; do not add its contents to Git.
