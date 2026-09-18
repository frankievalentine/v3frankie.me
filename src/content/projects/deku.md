---
title: Deku
description: A modern, lightweight self-hosted PaaS built with Rust, Angie, and Astro.
kind: Self-hosted PaaS
status: Available
featured: false
order: 6
stack:
  - rust
  - angie
  - astro
---

<img src="/images/projects/deku-dashboard-light.webp" alt="Deku server dashboard in light theme" class="block dark:hidden" />
<img src="/images/projects/deku-dashboard-dark.webp" alt="Deku server dashboard in dark theme" class="hidden dark:block" />

<a href="https://get-deku.vercel.app/" target="_blank" rel="noopener noreferrer">Deku</a> is a self-hosted platform for shipping apps without taking on the weight and complexity of a larger platform stack.

The goal is not just to make deployments work. It is to make the whole system understandable: routing, provisioning, deploy flow, and the operator experience should all feel legible from the start.

## Current focus

- Keep the core runtime small, fast, and predictable.
- Make the networking and web serving story feel clean instead of bolted on.
- Pair the infrastructure layer with an interface that feels intentional.

## Why it matters

There is still room for infrastructure tooling that favors clarity over sprawl. Deku is an attempt to build a platform that is pleasant to self-host, straightforward to reason about, and modern without becoming overdesigned.
