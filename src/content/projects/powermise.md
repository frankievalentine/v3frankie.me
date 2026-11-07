---
title: powermise
description: An unofficial desktop companion for mise. See every tool it manages, install the versions you want, keep them up to date, and check your setup's health from one window.
kind: Developer Tooling
status: Experimental
featured: false
order: 8
stack:
  - typescript
  - rust
  - tauri
  - react
  - mise
---

<a href="https://github.com/frankievalentine/powermise" target="_blank" rel="noopener noreferrer">powermise</a> is an unofficial desktop app for <a href="https://mise.jdx.dev" target="_blank" rel="noopener noreferrer">mise</a> on macOS, Windows, and Linux. It shows every tool mise manages, browses the full registry, and handles updates, project tools and tasks, and setup health. The <a href="https://powermise.pages.dev/#demo" target="_blank" rel="noopener noreferrer">live demo</a> runs the real interface in a browser. It isn't made by or affiliated with the mise project.

There is no powermise CLI, because mise is the CLI. The app reads mise's JSON output and changes things only by running mise's own commands, showing each one before it runs. It never edits your mise config. Anything it writes goes in its own `conf.d/` files, which you can read, and delete to undo.

It can also import versions from nvm, pyenv, Homebrew, and other version managers with a dry run first, and install AI coding agents along with their MCP servers, plugins, and skills through mise.

## Current focus

- Sign the macOS and Windows releases so the first launch no longer takes an extra step.
- Verify the app on real Windows 11 and Linux desktops.
- Keep every action showing its exact command, so people who start in the app learn the CLI.

## Why it matters

mise does a lot, but much of it sits behind commands and config files you have to already know about. powermise makes that visible in plain language without hiding what is happening underneath, and it leaves mise in charge of its own state.
