# v3frankie.me

![Astro](https://img.shields.io/badge/Astro-0C1222?style=for-the-badge&logo=astro&logoColor=FDFDFE)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Cloudflare Pages](https://img.shields.io/badge/Cloudflare_Pages-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)

Personal website of Frankie Valentine — photographer, engineer, and founder of [V3 Digital Studio](https://v3digital.studio).

- **Framework**: [Astro 5](https://astro.build/)
- **UI Components**: [basecoat-css](https://basecoat-css.com/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Deployment**: [Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/)
- **Package Manager**: [Bun](https://bun.sh/)

## Project Structure

| Path                       | Description                                                  |
| :------------------------- | :----------------------------------------------------------- |
| `public/`                  | Static assets, favicon, avatar, PWA manifest, robots.txt     |
| `src/layouts/Layout.astro` | Sidebar layout used by all pages                             |
| `src/pages/`               | All routes — index, posts, photography, newsletter, RSS, 404 |
| `src/content/posts/`       | Blog posts in Markdown and MDX                               |
| `src/content.config.ts`    | Content collection schema                                    |
| `src/components/`          | Astro components including search and back-to-top            |
| `src/styles/global.css`    | Global styles — Tailwind + basecoat imports                  |
| `src/utils.ts`             | Shared utilities — `formatDate`, `readingTime`               |
| `wrangler.jsonc`           | Cloudflare Pages deployment config                           |

## Running locally

Clone the repo and install dependencies with Bun.

```bash
gh repo clone frankievalentine/v3frankie.me
cd v3frankie.me
bun install
```

Search requires a built pagefind index. Run a build first, then start the dev server.

```bash
bun run build
bun run dev
```

## Commands

| Command             | Action                                        |
| :------------------ | :-------------------------------------------- |
| `bun run dev`       | Start local dev server at `localhost:4321`    |
| `bun run build`     | Build production site to `./dist/`            |
| `bun run preview`   | Preview the production build locally          |
| `bun run cfpreview` | Preview via Wrangler against Cloudflare Pages |
| `bun run cfdeploy`  | Deploy to Cloudflare Pages                    |
| `bun run cftypes`   | Generate Cloudflare Workers types             |

## Deploy

The site deploys automatically to Cloudflare Pages on every push to `main`.

To deploy manually, authenticate with Cloudflare and run:

```bash
bunx wrangler login
bun run cfdeploy
```
