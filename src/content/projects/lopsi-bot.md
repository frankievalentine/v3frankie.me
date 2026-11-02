---
title: Lopsi Bot
description: An open-source dashboard for running AI teammates, each on its own isolated VM and reachable only over your tailnet.
kind: Agent Platform
status: In progress
featured: true
order: 3
stack:
  - react
  - hono
  - postgres
  - tailscale
  - boat
---

Lopsi Bot is an open-source dashboard for running a crew of AI agents for your company. Each agent lives on its own Boat virtual machine, and your people, the agents, and your company services talk to each other only over Tailscale. The dashboard has no public login page because it is not on the public internet at all.

It is built around safer defaults than most agent platforms: one computer per agent, no AI keys on those computers, secrets the agent can request by name but never read, and consequential actions that wait for a person to approve them in the chat.

Lopsi Bot was inspired by <a href="https://github.com/elie222/rakazo" target="_blank" rel="noopener noreferrer">Rakazo</a>.

## Current focus

- Lock the backend down to the tailnet so there is no public surface to attack.
- Build out the dashboard for managing agents, models, secrets, and approvals.
- Document the threat model, including what a tricked agent can still do.

## Why it matters

Agent platforms tend to fail in the same places: a public admin panel, long-lived keys inside agent machines, and agents that can reach everything once one of them is tricked. Lopsi Bot starts from the opposite defaults so giving agents real work does not mean giving them everything.
