# v3frankie.me

<img src="https://img.shields.io/badge/Astro-0C1222?style=for-the-badge&logo=astro&logoColor=FDFDFE" alt="Astro Logo" />

- **Framework**: [Astro](https://astro.build/)
- **Database**: [Cloudflare D1](https://developers.cloudflare.com/d1/)
- **Deployment**: [Fly.io](https://fly.io/)
- **CMS**: [Keystatic](https://keystatic.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Package Manager**: [pnpm](https://pnpm.io/)
- **CI/CD**: [Github Actions ](https://fly.io/docs/app-guides/continuous-deployment-with-github-actions/)

## Project Structure

| File                   | Description                                   |
| :--------------------- | :-------------------------------------------- |
| `public/*`             | Assets, fonts, robots, sitemap, and manifest. |
| `src/components/*`     | Project components.                           |
| `pages/*`              | All other static pages.                       |
| `pages/index.astro`    | Astro entry page.                             |
| `pages/site.config.ts` | Main site configuration data.                 |
| `styles/*`             | A small amount of global styles. Tailwind.    |
| `layouts/*`            | Astro page layouts.                           |
| `content/*`            | Blog content generated from Keystatic.        |

## Running this site locally

Fork and change your repo's description.
Clone your newly forked repo using the Github CLI.

Make sure you have bun installed, or use pnpm.

```bash
gh repo fork frankievalentine/v3frankie.me
gh repo clone <insert your repo link here>
cd <your repo>
pnpm install
pnpm run dev
```

## Deploy your own

Install the [flyctl](https://formulae.brew.sh/formula/flyctl) using Homebrew and authenticate your Fly.io account.

Use fly.io's [dockerfile generator](https://github.com/fly-apps/dockerfile-node) to overwrite the current Dockerfile.

```bash
pnpx @flydotio/dockerfile@latest
```

Then...

```bash
fly launch
```

More information on deploying an Astro project with Fly.io [here](https://fly.io/docs/js/frameworks/astro/).
