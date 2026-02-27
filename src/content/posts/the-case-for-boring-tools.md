---
title: The case for boring tools
description: The tools you understand deeply are more valuable than the tools that are theoretically optimal. Boring is underrated.
date: 2025-07-07
tags: [engineering]
---

Every few months a new tool arrives that promises to fix something that wasn't clearly broken. The response in engineering circles follows a pattern: early adopters publish enthusiastic posts, a wave of FOMO-driven migrations begins, and then — quietly — most teams drift back toward whatever they were using before, having learned something specific about why the new thing didn't fit.

I've done this enough times to have developed a strong prior toward boring tools.

## What boring means

Boring doesn't mean bad. It means: mature, widely understood, with a large surface area of documented failure modes. PostgreSQL is boring. Git is boring. HTTP is boring. These tools have had their rough edges worn smooth by decades of use in hostile conditions.

The interesting property of boring tools isn't that they're simple — it's that their failure modes are *legible*. When something goes wrong, the answer is probably on the first page of search results, or in a colleague's memory, or in a ten-year-old Stack Overflow post that still applies because the tool hasn't changed in ways that invalidate it.

## The cost of the new

New tools have their failure modes too, but they're undocumented. The answers aren't on the first page of search results. The tool has often changed since the blog posts were written. The error message you're seeing may have only been seen by three other people, none of whom left a trail.

This isn't an argument against new tools — sometimes the new thing genuinely solves a problem the old thing can't. It's an argument for being honest about the cost. There's a reason experienced engineers tend toward conservatism in tooling choices while being more willing to experiment in other areas.

## Where this leads

I try to make the same tool decision that a team two years from now will find reasonable. That usually means choosing the option with more prior art, better documentation, and a larger community — even when the bleeding-edge alternative is technically superior on paper.

The best tool is usually the one where "how do I do X?" has a clear, settled answer. Everything else is interesting, but interesting has carrying costs.
