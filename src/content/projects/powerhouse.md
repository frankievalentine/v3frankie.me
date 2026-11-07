---
title: powerhouse
description: Your team's own fleet of AI agents, self-hosted in your Cloudflare account behind Cloudflare Access, where anything that changes something outside it waits for approval.
kind: Agent Platform
status: Available
featured: false
order: 4
stack:
  - typescript
  - cloudflare workers
  - durable objects
  - ai gateway
  - mcp
---

<a href="https://github.com/frankievalentine/powerhouse" target="_blank" rel="noopener noreferrer">powerhouse</a> is a fleet of AI agents that runs in your own Cloudflare account. You describe a job, a decision model routes it to the right role in under a second, and an agent does the work with real tools and your connected accounts. The <a href="https://usepowerhouse.pages.dev" target="_blank" rel="noopener noreferrer">site</a> has a scripted demo, and a Deploy to Cloudflare button sets up a copy in a few short steps.

Each role has its own purpose, instructions, model, tools, allowed sites, connections, and skills. Agents can read and search the web, drive a real browser, send email, and use Linear, Notion, GitHub, or any remote MCP server. Jobs can run on a schedule, and every member of an org sees the same live view of what is running and what it is estimated to cost.

Sign-in goes through Cloudflare Access, provider keys stay on your AI Gateway, and no powerhouse server sits between you and Cloudflare. Emails and writes to connected accounts wait for a person to approve them, with the full details shown.

## Current focus

- Let what teams ask for set the roadmap, grouped by the problem behind each request.
- Reach people through their own agents over MCP rather than through chat integrations.
- Keep updates easy to take: each release works with data saved by earlier versions, and deployed copies get it as a pull request.

## Why it matters

Agents get more useful as they get access to real accounts, and that access is what makes them risky to hand over to someone else's service. powerhouse keeps the data, keys, and sign-in in an account you already control, and keeps a person in the loop for the actions that matter.
