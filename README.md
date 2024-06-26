# v3frankie.me

<!-- <img src="https://img.shields.io/badge/Astro-0C1222?style=for-the-badge&logo=astro&logoColor=FDFDFE" alt="Astro Logo" /><img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white" alt="Github Actions" /><img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white" alt="Docker Logo" /><img src="https://img.shields.io/badge/bun-282a36?style=for-the-badge&logo=bun&logoColor=fbf0df" alt="Bun Logo" /> -->

- **Framework**: [Astro](https://astro.build)
- **Database**: [AstroDB](https://astrodb.build/db)
- **Deployment**: [Fly.io](https://fly.io)
- **CMS**: [Keystatic](https://keystatic.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Runtime**: [Bun](https://bun.sh/)
- **CI/CD**: [Github Actions ](https://fly.io/docs/app-guides/continuous-deployment-with-github-actions/)

## Project Structure

- `db/*` - AstroDB configuration and contents.
- `public/*` - Assets, fonts, robots, sitemap, and manifest.
- `src/components/*` - Project components.
- `pages/*` - All other static pages.
- `pages/posts*` - Dynamically routed blog post pages.
- `pages/index.astro` - Astro entry page.
- `pages/site.config.ts` - Main site configuration data.
- `styles/*` - A small amount of global styles. I'm mostly using vanilla Tailwind CSS.
- `layouts/*` - Astro page layouts.
- `content/*` - Blog content generated from Keystatic.

## Running this site locally

Fork and change your repo's description.
Clone your newly forked repo using the Github CLI.

Make sure you have bun installed, or use pnpm.

```bash
gh repo fork frankievalentine/v3frankie.me
gh repo clone <insert your repo link here>
cd <your repo>
bun install
bun run dev
```

## Deploy your own

Install the [flyctl](https://formulae.brew.sh/formula/flyctl) using Homebrew and authenticate your Fly.io account.

Use fly.io's [dockerfile generator](https://github.com/fly-apps/dockerfile-node) to overwrite the current Dockerfile.

`bunx --yes @flydotio/dockerfile@latest`

Then `fly launch`.

More information [here](https://fly.io/docs/js/frameworks/astro/).
