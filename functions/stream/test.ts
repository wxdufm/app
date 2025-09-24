export const onRequest = async () =>
  new Response("ok: stream function reachable", {
    headers: { "Content-Type": "text/plain" },
  });

