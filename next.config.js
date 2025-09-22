/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // tells Next to emit static HTML in ./out
  async rewrites() {
    return [
      {
        source: "/admin",
        destination: "/admin/index.html",
      },
    ]
  },
};

module.exports = nextConfig;
