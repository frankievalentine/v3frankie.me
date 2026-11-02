---
title: Routrr
description: Picks the best model for each prompt in OpenCode and Pi, using a fast decision model and a curated list of which models are best at what.
kind: AI Tooling
status: In progress
featured: true
order: 2
stack:
  - typescript
  - opencode
  - pi
  - swiftui
  - tauri
---

Routrr routes each prompt to the model best suited for it. Plugins for OpenCode and Pi send every prompt to a fast decision model, which classifies the task in milliseconds and picks a model from a curated catalog of which models are best at what.

It starts in watch mode, where every decision is logged and nothing is switched. Once you trust its picks, route mode switches models for you. A menu bar app on macOS and a tray app on Windows and Linux show recent decisions and manage settings without ever sitting in the path of a prompt.

## Current focus

- Keep decisions fast enough that routing never slows down a prompt.
- Curate the model catalog around real strengths rather than benchmark scores alone.
- Prepare the plugins and desktop apps for a first public release.

## Why it matters

No single model is best at everything, and picking one by hand for every prompt is tedious. Routrr makes that choice automatically while keeping every decision visible, so you can see why a model was chosen and stay in control of quality and cost.
