# wxdnew-app

React Native app built with Expo 54, NativeWind, and TypeScript. Pulls live data from the WXDU public API at `api.wxdu.art`.

## Why localtunnel?

When you run `expo start`, it starts a local Metro bundler server on your machine (port 8081). For Expo Go on your phone to load the app, it needs to reach that server.

**The problem:** On WSL2 (Windows Subsystem for Linux), your dev environment runs inside a virtual network that your phone can't reach directly. The same issue applies on strict firewalls or across different networks.

**The solution:** [localtunnel](https://github.com/localtunnel/localtunnel) creates a public URL that forwards to your local server. No account, no auth tokens, no setup — just run it.

> **Why not ngrok?** `expo start --tunnel` uses a bundled ngrok v2 binary. ngrok dropped free account support for v2 agents in June 2026 (ERR_NGROK_121), so it no longer works without a paid plan.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Expo Go](https://expo.dev/go) installed on your phone

## Setup

From the **app directory** (`radio-2026/app-env/wxdnew-app/`):
```bash
npm install --legacy-peer-deps
```

## Running locally

You need two terminals each session.

### Terminal 1 — Tunnel Expo Metro bundler (port 8081)

```bash
npx localtunnel --port 8081
```

Copy the URL it gives you (e.g. `https://zzzz.loca.lt`).

### Terminal 2 — Start Expo

```bash
cd radio-2026/app-env/wxdnew-app
EXPO_PACKAGER_PROXY_URL=https://zzzz.loca.lt npx expo start
```

Replace `https://zzzz.loca.lt` with the URL from Terminal 1.

Scan the QR code with:
- **Android**: the Expo Go app
- **iPhone**: the default Camera app

> **Note:** localtunnel URLs are temporary — they change every time you restart the tunnel. Update `EXPO_PACKAGER_PROXY_URL` with the new URL and restart Expo (Terminal 2) so it picks up the change.

## Scripts

| Command | Description |
|---|---|
| `npx expo start` | Start Metro (use with `EXPO_PACKAGER_PROXY_URL` for tunnel) |
| `npm run android` | Start targeting Android emulator |
| `npm run ios` | Start targeting iOS simulator |
| `npm run web` | Start in browser |

## Tech

- [Expo](https://expo.dev) SDK 54
- [NativeWind](https://www.nativewind.dev) v4 (Tailwind CSS for React Native)
- [expo-router](https://expo.github.io/router) — file-based routing (same pattern as Next.js pages)
- [expo-av](https://docs.expo.dev/versions/latest/sdk/av/) — audio playback for the live stream
- TypeScript
