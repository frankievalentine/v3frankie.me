---
title: What film taught me about software
description: Film photography and software engineering share more than their practitioners tend to admit — particularly around the value of irreversibility.
date: 2025-10-03
tags: [photography, engineering, process]
---

I picked up a film camera the same year I started writing production code. The timing was accidental, but the two practices have been in conversation ever since.

The most useful thing film taught me is how to think about irreversibility.

## Committing to a decision

When you expose a frame of film, you're done. There's no undo, no version history, no going back. The shutter closed and that light hit that emulsion at that moment and that's what exists now. You make the best judgment you can and you live with it.

Software engineers rarely operate this way. We have version control, feature flags, rollback procedures, blue-green deployments. The cost of reversibility has dropped to nearly zero, and we've responded by reversing everything constantly — including decisions that didn't need to be reversed.

This isn't a complaint about tooling. It's an observation about what abundant reversibility does to decision-making. When anything can be undone, nothing is fully committed to. You end up with code that hedges, architectures that anticipate requirements that never materialize, abstractions built for flexibility that only adds friction.

## The cost of optionality

Options have a price. In photography, keeping your options open means a bag full of lenses you swap between, missing shots while you decide. In software, it means interfaces that accommodate every caller, configuration systems that configure everything, and systems too general to be good at anything specific.

The film photographer who shoots a 35mm prime all day comes home with better pictures than the one who spent the day agonizing over focal length. The constraint forces decisions earlier, when they're cheaper, and the output is more coherent for it.

## What this actually looks like

In practice: make the call, document why, and move on. If the decision is reversible, reverse it when you have evidence to. If it isn't, treat that seriously upfront instead of pretending everything is recoverable.

The mistake is in either direction — treating all decisions as irreversible (paralysis) or treating all decisions as reversible (drift). Film is useful as a calibration tool because it makes the asymmetry visceral in a way that a diff in a pull request doesn't.
