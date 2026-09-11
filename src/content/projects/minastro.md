---
title: minastro
description: An Astro personal-site template powered by EmDash, with CMS-managed content and media on Cloudflare Workers, D1, and R2.
kind: Site Template
status: Available
featured: false
order: 5
stack:
  - astro
  - emdash
  - cloudflare workers
  - d1
  - r2
links:
  repository: https://github.com/frankievalentine/minastro
---

minastro is a personal-site template built with Astro and [EmDash](https://emdashcms.com), running server-side on Cloudflare Workers. EmDash is a Git-free CMS that stores content in Cloudflare D1 and media in R2, so posts, projects, pages, and settings are all editable from a built-in admin.

Out of the box it includes a blog, a project portfolio, CMS-managed pages, search, RSS, tags, comments, and an optional newsletter. EmDash is the sole source of runtime content for CMS routes, so missing content fails visibly instead of silently rendering something else.

## Current focus

- Keep the template easy to set up and run locally with simulated D1, R2, and KV bindings.
- Treat EmDash as the source of runtime content while keeping presentation values in `src/site.config.ts`.
- Document the deployment path so provisioning on Cloudflare stays deliberate instead of improvised.

## Why it matters

Personal sites tend to drift between static files, hand-rolled content pipelines, and hosted platforms that hide too much of the process. minastro is an attempt to give a small Astro site a real content model without losing its simplicity.
