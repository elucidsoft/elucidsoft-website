---
title: "OriJS: Modular Backend Framework for Bun"
slug: orijs-framework-bun-release
summary: "OriJS brings NestJS-inspired modular architecture and dependency injection to the Bun runtime using a type-safe fluent builder API without decorators."
metaDescription: "OriJS is released for the Bun runtime: modular backend architecture with dependency injection, guards, and sagas configured without decorators or reflection."
status: published
datePublished: 2026-05-10
author: Eric Malamisura
category: Open Source
relatedArticles: []
---

Elucidsoft announces the initial release of **OriJS**, an open-source TypeScript backend web framework engineered specifically for the **Bun** runtime.

OriJS delivers the structural discipline of NestJS, including modular organization, dependency injection, controllers, guards, and interceptors, without the runtime overhead or debugging complexity of experimental TypeScript decorators and `reflect-metadata`.

## Philosophy and architecture

OriJS borrows proven architectural patterns across the TypeScript ecosystem:

- **From NestJS**: Inversion of control, modular providers, route guards, and execution interceptors.
- **From Elysia & Hono**: End-to-end type safety, composable middleware, and blazing-fast HTTP throughput on Bun.
- **From Fastify & Pino**: Schema-based request validation and high-performance structured JSON logging.

Instead of relying on unstable reflection metadata, OriJS configures modules and dependencies via an explicit, type-safe **fluent builder API**. Service injection graphs are visible in code, inspectable at build time, and easy to mock during unit testing.

## Pluggable provider ecosystem

OriJS separates core orchestration from infrastructure dependencies through swappable provider packages:

- `@orijs/validation`: TypeBox-based schema validation for requests and responses.
- `@orijs/config`: Validated environment configuration with secret management support.
- `@orijs/cache` & `@orijs/cache-redis`: Singleflight caching with Redis or in-memory backing.
- `@orijs/events` & `@orijs/bullmq`: Type-safe event broadcasting and background queue execution.
- `@orijs/workflows`: Saga-pattern distributed workflow orchestration with automated compensation steps.
- `@orijs/websocket`: Horizontally scalable WebSocket pub/sub with Redis adapters.
- `@orijs/logging`: High-throughput structured logging with child logger context.

OriJS is open source under the MIT license and hosted at [github.com/upstat-io/orijs](https://github.com/upstat-io/orijs). Documentation and guides are available at [orijs.org](https://orijs.org).
