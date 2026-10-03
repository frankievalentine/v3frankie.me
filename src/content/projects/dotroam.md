---
title: dotroam
description: A cross-platform dotfiles manager and community platform for sharing reproducible setup bundles.
kind: Developer Tooling
status: In progress
featured: false
order: 9
stack:
  - rust
  - astro
  - dotfiles
---

<img src="/images/projects/dotroam-light.webp" alt="dotroam community site in light theme" class="block dark:hidden" />
<img src="/images/projects/dotroam-dark.webp" alt="dotroam community site in dark theme" class="hidden dark:block" />

dotroam is a dotfiles manager built around taking your setup to any machine. A portable Rust CLI manages configuration across macOS, Linux, and Windows, while a community site is being built for discovering and sharing setup bundles.

The CLI previews changes before applying a bundle and records what it installs so removal can respect existing files, packages, and settings. Bundles can come from a local checkout or a pinned repository revision. The community site is currently a prototype, with public bundle releases still to come.

## Current focus

- Make machine setup understandable through previews and recorded changes.
- Keep bundles portable across operating systems and reproducible through pinned revisions.
- Connect the CLI, bundle registry, and community site into a practical publishing workflow.

## Why it matters

Moving to a fresh machine often means piecing together configuration, packages, and setup steps from memory. dotroam aims to make that setup easier to inspect, repeat, and share without losing control of the changes it makes.
