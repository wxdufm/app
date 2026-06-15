# wxdnew-app

React Native app built with Expo 54, NativeWind, and TypeScript. Content is pulled from TinaCMS via GraphQL.

## Why localtunnel?

When you run `expo start`, it starts a local Metro bundler server on your machine (port 8081). For Expo Go on your phone to load the app, it needs to reach that server — and your phone also needs to reach TinaCMS (port 4001) to fetch content.

**The problem:** On WSL2 (Windows Subsystem for Linux), your dev environment runs inside a virtual network that your phone can't reach directly. The same issue applies on strict firewalls or across different networks.

**The solution:** [localtunnel](https://github.com/localtunnel/localtunnel) creates a public URL that forwards to your local server. No account, no auth tokens, no setup — just run it.

> **Why not ngrok?** `expo start --tunnel` uses a bundled ngrok v2 binary. ngrok dropped free account support for v2 agents in June 2026 (ERR_NGROK_121), so it no longer works without a paid plan.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Expo Go](https://expo.dev/go) installed on your phone

## Setup

### 1. Install dependencies

From the **project root** (`radio-2026/`):
```bash
npm install
```

From the **app directory** (`radio-2026/app-env/wxdnew-app/`):
```bash
npm install --legacy-peer-deps
```

### 2. Configure your .env

Copy the example env file and fill in your TinaCMS tunnel URL (you'll get this in Step 3 below each session):
```bash
cp .env.example .env
```

`.env` should look like this — update `EXPO_PUBLIC_TINA_URL` and `EXPO_PUBLIC_SITE_URL` each session with a fresh localtunnel URL:
```
EXPO_PUBLIC_TINA_URL=https://xxxx.loca.lt/graphql
EXPO_PUBLIC_SITE_URL=https://xxxx.loca.lt/
```

## Running locally

You need five terminals each session. Start them in order and wait for each one to be ready before moving to the next.

### Terminal 1 — Start TinaCMS + Next.js (from project root)

```bash
cd radio-2026
npm run dev
```

This starts TinaCMS on port 4001 and Next.js on port 3000. Wait until you see `ready - started server on 0.0.0.0:3000` in the output before continuing.

### Terminal 2 — Tunnel TinaCMS (port 4001)

```bash
npx localtunnel --port 4001
```

Copy the URL it gives you (e.g. `https://xxxx.loca.lt`).

Open that URL in your browser. You will see a localtunnel confirmation page — enter your IP and click through. This allows your phone to make API requests through the tunnel.

Then update `EXPO_PUBLIC_TINA_URL` in your `.env`:
```
EXPO_PUBLIC_TINA_URL=https://xxxx.loca.lt/graphql
```
Note the `/graphql` at the end — the browser URL does not have it but the `.env` value does.

### Terminal 3 — Tunnel Next.js media server (port 3000)

```bash
npx localtunnel --port 3000
```

Copy the URL it gives you (e.g. `https://yyyy.loca.lt`) and update `EXPO_PUBLIC_SITE_URL` in your `.env`:
```
EXPO_PUBLIC_SITE_URL=https://yyyy.loca.lt
```

This is needed so your phone can load images, which are served by Next.js and stored in `public/uploads/`.

### Terminal 4 — Tunnel Expo Metro bundler (port 8081)

```bash
npx localtunnel --port 8081
```

Copy the URL it gives you (e.g. `https://zzzz.loca.lt`).

### Terminal 5 — Start Expo

```bash
cd radio-2026/app-env/wxdnew-app
EXPO_PACKAGER_PROXY_URL=https://zzzz.loca.lt npx expo start
```

Replace `https://zzzz.loca.lt` with the URL from Terminal 4.

Scan the QR code with:
- **Android**: the Expo Go app
- **iPhone**: the default Camera app

> **Note:** localtunnel URLs are temporary — they change every time you restart the tunnels. You'll need to update `.env` with the new URLs for Terminals 2 and 3, then restart Expo (Terminal 5) so it picks up the new values. Expo bakes `EXPO_PUBLIC_*` variables into the bundle at startup — a running Metro will not see `.env` changes until restarted.

> **If you get a 503 error:** The localtunnel for port 4001 likely dropped. Kill Terminal 2, restart it, get the new URL, update `.env`, and restart Expo. Visit the new tunnel URL in a browser to bypass the confirmation page before testing on your phone.

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
- TypeScript


## Expo Router
- Expo Router gives the same file-based routing as a Next.js page. This is another feature of Expo that allows for easy migration between the mobile app and the website.
- |` npx expo install expo-router expo-linking expo-constants expo-status-bar react-native-safe-area-context react-native-screens ` |

## expo-av
- Library that handles audio playback
|` npm install expo-av --legacy-peer-deps `|
