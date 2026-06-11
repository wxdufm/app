# wxdnew-app

React Native app built with Expo 54, NativeWind, and TypeScript.

## What is ngrok and why do we use it?

When you run `expo start`, it starts a local Metro bundler server on your machine (port 8081). For Expo Go on your phone to load the app, it needs to reach that server over the network.

**The problem:** On WSL2 (Windows Subsystem for Linux), your dev environment runs inside a virtual network that your phone can't see — even if your phone and PC are on the same WiFi. The same issue can come up with strict firewalls or when teammates are on different networks.

**What ngrok does:** It creates a secure tunnel from a public URL to your local server. Your phone connects to that public URL, ngrok forwards the traffic to your machine, and Expo Go loads your app — regardless of network setup.

This makes `--tunnel` the most reliable option for a team, since it works the same way for everyone no matter their OS or network.

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


## Expo Router
- Expo Router gives the same file-based routing as a Next.js page. This is another feature of Expo that allows for easy migration between the mobile app and the website.
- |` npx expo install expo-router expo-linking expo-constants expo-status-bar react-native-safe-area-context react-native-screens ` |

## expo-av
- Library that handles audio playback
|` npm install expo-av --legacy-peer-deps `|
