---
title: "Tools I use to depend less on big tech"
date: "2026-06-18"
description: "My current setup for minimizing reliance on any single provider."
---

I don't think you need to go full off-grid to take back some control. For me it's about spreading trust across smaller, more intentional providers — and self-hosting where it makes sense. Here's what that looks like right now.

## Passwords — Vaultwarden on Netcup

I run [Vaultwarden](https://github.com/dani-garcia/vaultwarden) (a lightweight Bitwarden-compatible server) on a small Netcup VPS. It's cheap, it's mine, and it syncs with all the official Bitwarden clients. No subscription, no trusting someone else's infrastructure with my most sensitive data.

Setting it up took maybe an hour with Docker. Maintenance is basically zero — I update the container every few weeks.

## Networking — Tailscale

[Tailscale](https://tailscale.com) ties my devices together in a private mesh network. I can reach my VPS, my home server, and anything else without exposing ports to the internet. It's also how I access Vaultwarden from anywhere without making it public.

WireGuard under the hood, zero config. One of those tools that just disappears once it's running.

## Browser — Zen

[Zen Browser](https://zen-browser.app) is Firefox-based, fast, and not trying to sell me anything. Vertical tabs, good defaults, no telemetry nonsense. It respects the fact that a browser should be a tool, not a platform.

## Search — Brave Search

[Brave Search](https://search.brave.com) has its own index (not a Google/Bing wrapper) and gives solid results without tracking. I don't use the Brave browser, but their search engine stands on its own.

## VPN — Mullvad

[Mullvad](https://mullvad.net) is €5/month, no account email, you can pay with cash if you want. They've been independently audited and their infrastructure is RAM-only. When I need a VPN, I trust them more than anyone else in the space.

## Email — Mailbox.org

[Mailbox.org](https://mailbox.org) is a German provider with solid privacy practices, calendar, contacts, and cloud storage bundled in. It's not flashy, but it works well and it means my email isn't being scanned to train an ad model.

## AI coding — OpenCode

[OpenCode](https://opencode.ai) is an open-source terminal-based AI coding assistant. You bring your own API key — Anthropic, OpenAI, whatever — and it just works in your terminal. No vendor lock-in to an IDE, no subscription to a platform that decides what models you can use. It's fast, transparent, and you stay in control of where your code goes.

## The point

None of this is about paranoia. It's about not having a single company own my identity, my communication, my passwords, and my browsing all at once. Spreading things out means no single failure point, no single entity to trust completely.

It takes a little more effort upfront. But once it's running, it's just... normal. And it feels better.
