#!/bin/bash

# Change into the app directory regardless of where the script is called from
cd "$(dirname "$0")"

echo "Starting localtunnel on port 8081..."

# Create a temporary file to capture localtunnel's output
TUNNEL_LOG=$(mktemp)

# Start localtunnel in the background, writing its output to the log file
# The & runs it as a background process so we can continue to the next step
npx localtunnel --port 8081 > "$TUNNEL_LOG" 2>&1 &
TUNNEL_PID=$!

# When this script exits (Ctrl+C or Expo closes), kill the tunnel process and clean up the log
trap "kill $TUNNEL_PID 2>/dev/null; rm -f $TUNNEL_LOG" EXIT

# Poll the log file once per second until localtunnel prints its public URL (up to 30s)
TUNNEL_URL=""
for i in $(seq 1 30); do
    TUNNEL_URL=$(grep -o 'https://[^ ]*\.loca\.lt' "$TUNNEL_LOG" | head -1)
    if [ -n "$TUNNEL_URL" ]; then
        break
    fi
    sleep 1
done

# If no URL was found after 30 seconds, print the tunnel output for debugging and exit
if [ -z "$TUNNEL_URL" ]; then
    echo "Error: could not get tunnel URL after 30s. Tunnel output:"
    cat "$TUNNEL_LOG"
    exit 1
fi

echo "Tunnel: $TUNNEL_URL"
echo "Starting Expo..."

# Pass the tunnel URL to Expo so it embeds it in the QR code instead of the local WSL2 address
# (Expo Go on your phone needs a public URL it can reach, not a WSL2 internal IP)
EXPO_PACKAGER_PROXY_URL="$TUNNEL_URL" npx expo start
