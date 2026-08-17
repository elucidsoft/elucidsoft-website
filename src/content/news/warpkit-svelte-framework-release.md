---
title: "WarpKit Released: Svelte 5 SPA Framework"
slug: warpkit-svelte-framework-release
summary: "WarpKit is released as a standalone Svelte 5 framework featuring state-oriented routing, a 10-phase navigation pipeline, and caching data layers."
metaDescription: "Elucidsoft releases WarpKit, an open-source Svelte 5 application framework with state-based routing, ten-phase navigation, and modular auth adapters."
status: published
datePublished: 2026-06-15
author: Eric Malamisura
category: Open Source
relatedArticles: []
---

Elucidsoft has released **WarpKit** as an open-source, standalone application framework for single-page web applications built with Svelte 5. WarpKit is published to npm across eight modular packages under the `@warpkit` scope.

WarpKit was created to address a structural deficiency in traditional client-side routers: treating routes solely as URL string patterns while delegating authentication checks, data preloading, and application states to scattered, ad-hoc route guards.

## State-based application routing

WarpKit structures single-page applications directly around explicit lifecycle states (such as unauthenticated visitor, onboarding, and authenticated tenant sessions):

- **10-phase navigation pipeline**: Every URL transition passes through a deterministic sequence of validation, middleware execution, guard evaluation, and data hydration steps.
- **Provider-agnostic authentication**: Dedicated adapters (such as `@warpkit/auth-firebase` and custom auth bridges) decouple application routing logic from specific identity providers.
- **Configuration-driven data layer**: Automatic ETag validation, stale-while-revalidate caching, and smart refetching via `@warpkit/data` and `@warpkit/cache`.
- **Deep proxy form binding**: Form inputs bind reactively through deep proxies and validate schemas against StandardSchema (including TypeBox and Zod) via `@warpkit/forms`.
- **Type-safe real-time WebSockets**: Typed message payloads, channel subscriptions, and automated reconnection handling via `@warpkit/websocket`.

## Battle-tested in production

Although tagged at version `0.0.1-alpha`, WarpKit is already battle-tested in real-world workloads, serving as the production frontend framework powering both Upstat and cloudlayer.io.

WarpKit is available under the MIT license. Developers can install the core packages via `bun add @warpkit/core @warpkit/data @warpkit/cache` and consult the comprehensive documentation at [warpkit.org](https://warpkit.org).
