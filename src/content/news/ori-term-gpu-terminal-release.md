---
title: "ori-term: GPU Terminal and Multiplexer"
slug: ori-term-gpu-terminal-release
summary: "ori-term enters alpha, uniting terminal emulation, multiplexing, and floating window management into a single GPU-rendered Rust application."
metaDescription: "Elucidsoft releases ori-term: GPU-accelerated terminal emulator and multiplexer in Rust featuring native splits, tabs, and cross-platform frameless chrome."
status: published
datePublished: 2026-04-20
author: Eric Malamisura
category: Open Source
relatedArticles: []
---

Elucidsoft announces the alpha release of **ori-term**, a GPU-accelerated terminal emulator written from scratch in Rust that combines terminal emulation, a multiplexer, and a window shell into a single standalone application.

## Eliminating layer friction

Modern terminal power users frequently stack three separate software layers: a terminal emulator, a multiplexer (such as tmux), and a desktop window manager. These independent tools often work at cross purposes: scrollback buffers fight across split panes, keybindings collide between layers, and nested redraws waste CPU cycles.

ori-term eliminates this friction by integrating these capabilities into a single cohesive runtime:

- **GPU-accelerated rendering engine**: High-fps scrolling under heavy output logs with near-zero idle CPU consumption, preserving battery life and cooling fans.
- **Native splits, tabs & floating panes**: Full multiplexing without tmux. Drag tabs seamlessly across windows, create nested splits, and layer floating panes freely.
- **True cross-platform parity**: Identical look, keybindings, and frameless window chrome across Linux, Windows, and macOS.
- **Modern typography & media**: First-class support for font ligatures, custom color themes, and inline image protocols.

## Status and availability

ori-term is currently at version `0.2.0-alpha.20260528` under the MIT license and is capable of functioning as a daily-driver terminal. Active roadmap items include background session detachment and remote headless client support.

Pre-compiled binary downloads and shell installation scripts are available at [oriterm.com](https://oriterm.com).
