/** @type {import('next').NextConfig} */
const nextConfig = {
  // If your Next version warns about `output: "export"`, you can omit it.
  // `next export` will still work without this flag.
  // output: "export",

  images: { unoptimized: true }, // <-- REQUIRED for `next export`
  trailingSlash: true            // <-- so /admin/ maps to /admin/index.html
};

module.exports = nextConfig;
