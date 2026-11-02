---
title: Runyard
description: A self-hosted dashboard for running GitHub and Forgejo CI runners on your own machines, connected over SSH and Tailscale.
kind: CI Infrastructure
status: Available
featured: true
order: 1
stack:
  - typescript
  - tailscale
  - github actions
  - forgejo
  - mcp
---

<a href="https://github.com/frankievalentine/runyard" target="_blank" rel="noopener noreferrer">Runyard</a> is a self-hosted dashboard and control service for CI runners. It runs on one machine, reaches your others over SSH and Tailscale, and installs GitHub and Forgejo runners on them after you review exactly what will change.

Instead of managing runners one by one, you describe capacity: a pool's labels, machines, and repositories become runners, either persistent or one per job. The dashboard shows machine health, every runner, and every queued job along with why it is waiting. An MCP server lets AI agents read your CI and prepare changes for you to run.

Runyard was inspired by <a href="https://github.com/aarondfrancis/fleet" target="_blank" rel="noopener noreferrer">aarondfrancis/fleet</a>.

## Current focus

- Keep machine setup to a single command, including fresh Linux containers and VPS hosts.
- Stay safe by default: nothing changes without a review, busy runners are never touched, and public repositories are refused unless allowed.
- Make it easy to prove a runner works with a short test job.

## Why it matters

Hosted CI minutes get expensive, and self-hosted runners tend to become a pile of hand-configured machines nobody wants to touch. Runyard treats runner capacity as something you can see, review, and change deliberately.
