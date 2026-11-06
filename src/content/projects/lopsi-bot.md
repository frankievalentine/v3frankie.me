---
title: Lopsi Bot
description: An open-source eve template for Vercel that gives you a crew of AI agents and a dashboard to talk to them.
kind: Agent Template
status: Available
featured: true
order: 3
stack:
  - eve
  - next.js
  - ai sdk
  - vercel
  - better auth
---

![Lopsi Bot dashboard with a crew of six agents in the sidebar and a chat with Lopsi open](/images/projects/lopsi-bot-dashboard.webp)

<a href="https://github.com/frankievalentine/lopsi-bot-eve" target="_blank" rel="noopener noreferrer">Lopsi Bot</a> is an open-source <a href="https://eve.dev" target="_blank" rel="noopener noreferrer">eve</a> template for Vercel: a crew of AI agents, each with its own instructions, tools, and model, plus a dashboard to work with them. A Deploy button clones the repository into your GitHub account and deploys it, and the <a href="https://lopsi-bot.vercel.app" target="_blank" rel="noopener noreferrer">demo</a> runs an example crew with scripted replies, so it needs no sign-in or model.

The dashboard handles chat with tool runs, approvals, and questions, and a computer panel shows what each chat's sandbox did. Connectors, email, and messaging channels can each be added with a single setup command.

## Current focus

- Keep the path from Deploy to a working crew short, with a setup command for each thing you add.
- Make template updates easy to spot and apply once a crew is running.
- Add tests around the failures that have already happened or would be costly.

## Why it matters

Agents are code, so the dashboard never changes a running one. Editing a crew member opens a pull request, and nothing changes until you merge it. Safe defaults cover the rest: the shell has no network, and anything that changes something asks first.
