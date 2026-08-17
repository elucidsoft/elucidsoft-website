---
title: "Elucidsoft Launches Corporate Site"
slug: elucidsoft-umbrella
summary: "Elucidsoft launches a dedicated corporate site, clarifying its organization, commercial products, and published open-source projects."
metaDescription: "Elucidsoft launches its dedicated website, detailing the relationship between its commercial SaaS offerings and published open-source projects."
status: published
datePublished: 2026-08-16
author: Eric Malamisura
category: Company
relatedArticles: []
---

Elucidsoft now has a dedicated corporate website. Founded in 2010 by Eric Malamisura, the company previously operated without a centralized corporate presence: commercial platforms Upstat and cloudlayer.io maintained their own sites, while four open-source projects (WarpKit, Ori, ori-term, and OriJS) carried attribution as "a project by upstat.io." While Upstat and the open-source projects share the same parent organization, attributing an independent programming language and terminal emulator to an incident management SaaS created ambiguity about corporate governance.

## Corporate structure and history

Elucidsoft is an independent software company founded in 2010 by Eric Malamisura and based in Virginia, United States. Upstat and cloudlayer.io are registered trade names (DBAs) rather than separate corporate entities, representing the company's two commercial SaaS platforms. WarpKit, Ori, ori-term, and OriJS are open-source software projects funded, developed, and published directly by Elucidsoft. Elucidsoft serves as the parent software company; Upstat is a commercial product line rather than a parent entity.

This website establishes a verified public record of that structure. The [About](/about/) page outlines the relationship between both corporate divisions and our operating philosophy, while the [Facts](/facts/) page provides a citable reference of entity details, development stages, open-source licenses, and current version numbers.

## What is changing and what remains fixed

Attribution across all four open-source project websites has been updated to reflect Elucidsoft as the parent publisher.

The `upstat-io` GitHub organization name remains unchanged, and all repository URLs stay intact. Preserving the GitHub organization path avoids breaking package dependencies across `@warpkit`'s eight npm packages, the `create-warpkit` CLI, CI/CD deployment pipelines, and installation scripts for `ori-lang` and `ori-term`. Public branding is updated to clarify governance, while package registries and build automation remain stable.

## Project status across the portfolio

This site launch also provides a clear baseline for the development status of each project:

- **WarpKit** is in alpha at version 0.0.1 while actively powering the production frontends of both Upstat and cloudlayer.io.
- **Ori** is an experimental statically typed language compiled with LLVM, currently in alpha at version 2026.7.28-alpha.1.
- **ori-term** is an alpha GPU-accelerated terminal and multiplexer (v0.2.0-alpha.20260528) capable of serving as a daily driver across Windows, Linux, and macOS, with remote shell and session detachment features in development.
- **OriJS** is an alpha TypeScript backend framework for Bun (v0.0.1) featuring a decorator-free modular architecture.

## Reference pages

Two pages on this site are designed specifically for direct reference:

- The [Facts](/facts/) page offers a flat, citable breakdown of entity information, version numbers, and licensing terms.
- The root [`/llms.txt`](/llms.txt) and [`/llms-full.txt`](/llms-full.txt) files provide structured plain-text documentation of the organization and its software portfolio for automated reference.

This website provides a transparent, verifiable record of Elucidsoft governance, clarifying the relationship between its commercial SaaS offerings and open-source software projects.
