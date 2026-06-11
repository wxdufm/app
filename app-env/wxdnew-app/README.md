# wxdnew-app

React Native app built with Expo 54, NativeWind, and TypeScript.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Expo Go](https://expo.dev/go) installed on your phone
- A free [ngrok](https://ngrok.com) account

## Setup

### 1. Install dependencies

```bash
cd app-env/wxdnew-app
npm install --legacy-peer-deps
```

### 2. Set up ngrok (one-time per developer)

Sign up at [ngrok.com](https://ngrok.com), then copy your auth token from the dashboard and run:

```bash
npx ngrok authtoken YOUR_TOKEN_HERE
```

## Running the app

```bash
npx expo start --tunnel
```

Scan the QR code in your terminal with:
- **Android**: the Expo Go app
- **iPhone**: the default Camera app

The `--tunnel` flag routes traffic through ngrok so the app works regardless of network or OS (WSL2, Mac, Linux, etc.).

## Scripts

| Command | Description |
|---|---|
| `npx expo start --tunnel` | Start with tunnel (recommended for team dev) |
| `npm run android` | Start targeting Android emulator |
| `npm run ios` | Start targeting iOS simulator |
| `npm run web` | Start in browser |

## Tech

- [Expo](https://expo.dev) SDK 54
- [NativeWind](https://www.nativewind.dev) v4 (Tailwind CSS for React Native)
- TypeScript
