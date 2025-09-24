// functions/stream/index.ts
// HTTPS proxy for your Icecast/MP3 origin.
// Route: https://wxdu.art/stream

export const onRequest: PagesFunction = async ({ request }) => {
  const origin = "http://152.3.0.231:8000/wxdu192.mp3";

  // Pass through Range header so the browser can resume/seek if it wants.
  const inHeaders = new Headers(request.headers);
  const pass = new Headers({ "User-Agent": "wxdu-art-proxy" });
  const range = inHeaders.get("range");
  if (range) pass.set("range", range);

  let originResp: Response;
  try {
    originResp = await fetch(origin, {
      headers: pass,
      redirect: "follow",
      // disable caching for live stream
      cf: { cacheTtl: 0, cacheEverything: false },
    });
  } catch (err: any) {
    // If the origin is unreachable (firewall/port block), tell us plainly.
    return new Response(`Origin fetch failed: ${err?.message ?? "unknown error"}`, {
      status: 502,
      headers: { "Content-Type": "text/plain", "Cache-Control": "no-store" },
    });
  }

  // Copy headers but normalize for audio streaming
  const out = new Headers(originResp.headers);

  // force a stable content type
  out.set("Content-Type", "audio/mpeg");
  // no CDN/browser caching for live stream
  out.set("Cache-Control", "no-store");

  // If your origin sends transfer encodings/content-encodings that confuse the client,
  // you can strip them:
  out.delete("Content-Encoding");

  // If you ever serve this from a different subdomain and hit CORS issues:
  // out.set("Access-Control-Allow-Origin", "*");

  // Return the streamed body directly
  return new Response(originResp.body, {
    status: originResp.status,
    statusText: originResp.statusText,
    headers: out,
  });
};

