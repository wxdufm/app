// functions/stream/index.js
export const onRequest = async () => {
  const origin = "http://152.3.0.231:8000/wxdu192.mp3"; 

  // Fetch the origin stream; disable CF cache for live audio
  const resp = await fetch(origin, {
    headers: { "User-Agent": "wxdu-art-proxy" },
    cf: { cacheTtl: 0, cacheEverything: false },
  });

  // Copy headers and ensure correct content type; don't cache
  const headers = new Headers(resp.headers);
  headers.set("Content-Type", "audio/mpeg");
  headers.set("Cache-Control", "no-store");

  // Return the streamed body directly (no buffering)
  return new Response(resp.body, {
    status: resp.status,
    headers,
  });
};

