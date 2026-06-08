/** @type {import('next').NextConfig} */
const nextConfig = {
  // If your Next version warns about `output: "export"`, you can omit it.
  // `next export` will still work without this flag.
  // output: "export",

  images: { unoptimized: true }, // <-- REQUIRED for `next export`
  trailingSlash: true            // <-- so /admin/ maps to /admin/index.html
  ,
  // BELOW IS WIP
  async rewrites() {
    return [
      // Rewrite blog?page=N (query) to the archived static filename form.
      {
        source: '/archive/legacy/blogger/blog',
        has: [
          { type: 'query', key: 'page', value: '(?<page>.*)' }
        ],
        destination: '/archive/legacy/blogger/blog%3Fpage=:page'
      },
      {
        source: '/archive/legacy/weeklycharts/charts',
        has: [
          { type: 'query', key: 'page', value: '(?<page>.*)' }
        ],
        destination: '/archive/legacy/weeklycharts/charts%3Fpage=:page'
      }
    ]
  }
};

module.exports = nextConfig;
