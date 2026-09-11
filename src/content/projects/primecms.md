---
title: primecms
description: A modular content platform monorepo, with packages for content parsing, editing, codecs, and Astro, Vite, CLI, AI, and MCP integrations.
kind: Content Platform
status: In progress
featured: true
order: 1
stack:
  - Astro
  - Vite
  - Tiptap
  - MCP
  - AI
---

primecms is a modular content platform organized as a monorepo. The work spans a core content model and parsing, an editor, codecs, and the integrations that connect content to real projects: a Vite plugin, a CLI, import tooling, a Tiptap editor layer, AI and MCP packages, an Astro integration, and an admin UI.

The goal is to keep the pieces composable. Rather than one monolithic system, primecms treats content parsing, editing, and delivery as separate packages that can be adopted where they fit.

## Current focus

- Keep the package boundaries clean so each layer can be used on its own.
- Build a content core that the other packages and integrations can depend on.
- Connect authoring and delivery through consistent editor, codec, and framework integrations.

## Why it matters

Content tooling tends to be either tightly coupled to one framework or too abstract to adopt incrementally. primecms is an attempt to make the pieces modular enough to compose while still forming a coherent platform.
