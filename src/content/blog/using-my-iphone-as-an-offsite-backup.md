---
title: Using my iPhone as an offsite backup
date: "2026-06-24"
description: Backing up Vaultwarden using a simple iOS shortcut.
---

I self-host [Vaultwarden](https://github.com/dani-garcia/vaultwarden) and already back up the encrypted database to my [Mailbox.org](https://mailbox.org) cloud storage via rclone on a nightly schedule. That works well, but I figured I could cheaply add another layer of redundancy using something I already have on me every day, with 99.99% uptime: my phone.

The idea is simple. The server already uploads an encrypted backup to Mailbox Drive over WebDAV. My phone can pull from that same WebDAV endpoint with a scheduled iOS Shortcut, save it locally, and iCloud syncs it from there. One backup job on the server, three storage locations, zero extra cost.

## How it works

A cron job on the server runs at midnight, encrypts the Vaultwarden SQLite database with GPG (symmetric AES-256), and uploads the `.tar.gz.gpg` file to Mailbox Drive via rclone. It keeps the last 7 copies there for versioning and cleans up anything older.

On the phone, an iOS Shortcut runs at 1am on a time-based automation. It hits the Mailbox Drive WebDAV endpoint, pulls the latest encrypted backup, and overwrites the previous copy in iCloud Drive. No versioning, just always the latest. The phone doesn't know anything about Vaultwarden. It's just fetching a file from a URL.

At any given moment, the encrypted vault exists in:

- **Mailbox Drive** (last 7 versions, one uploaded per night at midnight)
- **iCloud Drive** (the latest copy, replaced nightly via the Shortcut)
- **The iPhone itself** (hardware-encrypted, inaccessible without the passcode)

If my server goes down, I open iCloud Drive. If Mailbox.org has an outage, iCloud has it. The file is GPG-encrypted with a key that never leaves my server, so every copy everywhere is an opaque blob regardless of who's storing it. Not to mention the vault data itself is already encrypted at the row level inside the database.

## Why I like this

The phone adds a storage location without requiring any changes to the server. The server does its thing and has no idea the phone exists. And the iPhone's hardware encryption means even the local copy on the device is protected at rest without the passcode.

It's not a complicated setup. A single Shortcut with a URL fetch, an error check, and a file save. Runs at 1am while the phone charges. Self-hosting a password manager means the recovery bar is higher than almost anything else, so having the vault in multiple places with minimal effort feels like a reasonable tradeoff for an afternoon of setup.

If you have thoughts or a different approach, feel free to [shoot me an email](mailto:jacob@wennebro.com). :)
